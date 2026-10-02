/**
 * Rate Limiter for FamilySearch API
 *
 * Implements token bucket algorithm for rate limiting and retry logic
 * with exponential backoff for 429 responses.
 */

import { isRetryableError } from "./errors";
import type { RateLimiterConfig } from "./types";

/** Our own deadline abort must not be retried. A CORS-hidden 429 arrives as a network error and should. */
const isCallerAbort = (error: unknown): boolean => {
	const original = (error as { originalError?: { name?: string } })
		?.originalError;
	const name = original?.name ?? (error as { name?: string })?.name;
	return name === "AbortError" || name === "TimeoutError";
};

export class RateLimiter {
	private tokens: number;
	private lastRefill: number;
	/** After a throttle response, every caller waits — not only the request that failed. */
	private cooldownUntil = 0;
	/** After the pause, stay under the normal pace so the next burst does not trip the limit again. */
	private slowedUntil = 0;
	private readonly requestsPerSecond: number;
	private readonly maxBurst: number;
	private readonly maxRetries: number;
	private readonly initialBackoffMs: number;
	private readonly maxBackoffMs: number;
	private readonly jitterFactor: number;

	constructor(config: RateLimiterConfig = {}) {
		this.requestsPerSecond = config.requestsPerSecond ?? 10;
		this.maxBurst = config.maxBurst ?? 20;
		this.maxRetries = config.maxRetries ?? 3;
		this.initialBackoffMs = config.initialBackoffMs ?? 1000;
		this.maxBackoffMs = config.maxBackoffMs ?? 30000;
		this.jitterFactor = config.jitterFactor ?? 0.3;

		this.tokens = this.maxBurst;
		this.lastRefill = Date.now();
	}

	/** Normal pace is 10/s. After a throttle we stay at 4/s for a short while. */
	private pacePerSecond(): number {
		if (Date.now() < this.slowedUntil) {
			return Math.min(this.requestsPerSecond, 4);
		}
		return this.requestsPerSecond;
	}

	/**
	 * Refill tokens based on elapsed time
	 */
	private refillTokens(): void {
		const now = Date.now();
		// A penalty pause must not bank a fresh burst of tokens.
		if (now < this.cooldownUntil) {
			return;
		}
		const elapsed = now - this.lastRefill;
		const tokensToAdd = (elapsed / 1000) * this.pacePerSecond();

		this.tokens = Math.min(this.maxBurst, this.tokens + tokensToAdd);
		this.lastRefill = now;
	}

	private async waitOutCooldown(): Promise<void> {
		const pause = this.cooldownUntil - Date.now();
		if (pause > 0) {
			await new Promise((resolve) => setTimeout(resolve, pause));
		}
	}

	/**
	 * Wait for a token to become available
	 */
	private async waitForToken(): Promise<void> {
		await this.waitOutCooldown();
		this.refillTokens();

		if (this.tokens >= 1) {
			this.tokens -= 1;
			return;
		}

		// Calculate wait time for next token
		const waitMs = (1 / this.pacePerSecond()) * 1000;
		await new Promise((resolve) => setTimeout(resolve, waitMs));

		// Try again after waiting
		return this.waitForToken();
	}

	/**
	 * Calculate backoff delay for retry
	 */
	private calculateBackoff(attempt: number, retryAfter?: number): number {
		// Use Retry-After header if provided
		if (retryAfter) {
			return retryAfter * 1000;
		}

		// Exponential backoff with jitter
		const exponentialDelay =
			this.initialBackoffMs * Math.pow(2, attempt - 1);
		// Add jitter (randomness) to prevent thundering herd problem
		const jitter = Math.random() * this.jitterFactor * exponentialDelay;
		return Math.min(exponentialDelay + jitter, this.maxBackoffMs);
	}

	/**
	 * Execute a request with rate limiting and retry logic
	 */
	async execute<T>(
		requestFn: () => Promise<T>,
		options: {
			onRetry?: (attempt: number, delay: number) => void;
		} = {}
	): Promise<T> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
			// Wait for rate limit token (except on retries after 429)
			if (attempt === 0) {
				await this.waitForToken();
			}

			try {
				return await requestFn();
			} catch (error) {
				lastError = error as Error;

				// 429 often never reaches JS: FamilySearch omits CORS headers,
				// so the browser reports net::ERR_ABORTED and we only see a
				// network error. 503 is a normal response. Both are worth
				// another try; a timeout abort is not.
				if (
					attempt < this.maxRetries &&
					!isCallerAbort(error) &&
					isRetryableError(error)
				) {
					const retryAfter =
						this.extractRetryAfter(error) ??
						(error as { retryAfter?: number }).retryAfter;
					const delay = this.calculateBackoff(
						attempt + 1,
						retryAfter
					);
					// Hold every later request for the same pause, and start
					// the bucket empty so we don't burst again at 20.
					this.cooldownUntil = Math.max(
						this.cooldownUntil,
						Date.now() + delay
					);
					this.tokens = 0;
					this.lastRefill = this.cooldownUntil;
					this.slowedUntil = Math.max(
						this.slowedUntil,
						this.cooldownUntil + 20_000
					);

					options.onRetry?.(attempt + 1, delay);

					await new Promise((resolve) => setTimeout(resolve, delay));
					continue;
				}

				throw error;
			}
		}

		// Should never reach here, but throw last error if we do
		throw lastError || new Error("Request failed after retries");
	}

	/**
	 * Type guard for error with response headers
	 */
	private hasResponseHeaders(
		error: unknown
	): error is { response: { headers: Record<string, string> } } {
		return (
			typeof error === "object" &&
			error !== null &&
			"response" in error &&
			typeof (error as { response?: unknown }).response === "object" &&
			(error as { response?: unknown }).response !== null &&
			"headers" in
				((error as { response?: unknown }).response as object) &&
			typeof (
				(error as { response?: unknown }).response as {
					headers?: unknown;
				}
			).headers === "object"
		);
	}

	/**
	 * Extract Retry-After header from error response
	 */
	private extractRetryAfter(error: unknown): number | undefined {
		if (!this.hasResponseHeaders(error)) {
			return undefined;
		}

		const retryAfterHeader = error.response.headers["retry-after"];

		if (retryAfterHeader) {
			const seconds = parseInt(retryAfterHeader, 10);
			if (!isNaN(seconds)) {
				return seconds;
			}
		}

		return undefined;
	}

	/**
	 * Reset the rate limiter state
	 */
	reset(): void {
		this.tokens = this.maxBurst;
		this.lastRefill = Date.now();
		this.cooldownUntil = 0;
		this.slowedUntil = 0;
	}
}
