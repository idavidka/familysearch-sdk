/**
 * Rate Limiter for FamilySearch API
 *
 * Implements token bucket algorithm for rate limiting and retry logic
 * with exponential backoff for 429 responses.
 */

import type { RateLimiterConfig } from "./types";

export class RateLimiter {
	private tokens: number;
	private lastRefill: number;
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

	/**
	 * Refill tokens based on elapsed time
	 */
	private refillTokens(): void {
		const now = Date.now();
		const elapsed = now - this.lastRefill;
		const tokensToAdd = (elapsed / 1000) * this.requestsPerSecond;

		this.tokens = Math.min(this.maxBurst, this.tokens + tokensToAdd);
		this.lastRefill = now;
	}

	/**
	 * Wait for a token to become available
	 */
	private async waitForToken(): Promise<void> {
		this.refillTokens();

		if (this.tokens >= 1) {
			this.tokens -= 1;
			return;
		}

		// Calculate wait time for next token
		const waitMs = (1 / this.requestsPerSecond) * 1000;
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

				// Check if it's a 429 (Too Many Requests) error
				const statusCode =
					(error as { statusCode?: number }).statusCode;
				if (statusCode === 429 && attempt < this.maxRetries) {
					// Extract Retry-After header if available
					const retryAfter = this.extractRetryAfter(error);
					const delay = this.calculateBackoff(attempt + 1, retryAfter);

					options.onRetry?.(attempt + 1, delay);

					await new Promise((resolve) => setTimeout(resolve, delay));
					continue;
				}

				// For other errors or max retries reached, throw immediately
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
	}
}
