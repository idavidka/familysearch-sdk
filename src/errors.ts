/**
 * FamilySearch SDK Error Handling
 *
 * Enhanced error types and utilities for consistent error handling
 */

import type { FamilySearchApiResponse } from "./types";

/**
 * Base error class for FamilySearch SDK
 */
export class FamilySearchError extends Error {
	readonly code: string;

	constructor(message: string, code: string) {
		super(message);
		this.name = "FamilySearchError";
		this.code = code;
		Object.setPrototypeOf(this, FamilySearchError.prototype);
	}
}

/**
 * Authentication error (401, 403)
 */
export class AuthenticationError extends FamilySearchError {
	readonly statusCode: number;

	constructor(message: string, statusCode: number = 401) {
		super(message, "AUTHENTICATION_ERROR");
		this.name = "AuthenticationError";
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, AuthenticationError.prototype);
	}
}

/**
 * Resource not found error (404)
 */
export class NotFoundError extends FamilySearchError {
	readonly resourceType: string;
	readonly resourceId: string;

	constructor(resourceType: string, resourceId: string) {
		super(`${resourceType} not found: ${resourceId}`, "NOT_FOUND");
		this.name = "NotFoundError";
		this.resourceType = resourceType;
		this.resourceId = resourceId;
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends FamilySearchError {
	readonly retryAfter?: number;

	constructor(message: string, retryAfter?: number) {
		super(message, "RATE_LIMIT_EXCEEDED");
		this.name = "RateLimitError";
		this.retryAfter = retryAfter;
		Object.setPrototypeOf(this, RateLimitError.prototype);
	}
}

/**
 * Validation error (400)
 */
export class ValidationError extends FamilySearchError {
	readonly details?: unknown;

	constructor(message: string, details?: unknown) {
		super(message, "VALIDATION_ERROR");
		this.name = "ValidationError";
		this.details = details;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

/**
 * Server error (5xx)
 */
export class ServerError extends FamilySearchError {
	readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message, "SERVER_ERROR");
		this.name = "ServerError";
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, ServerError.prototype);
	}
}

/**
 * Network error (connection issues, timeouts)
 */
export class NetworkError extends FamilySearchError {
	readonly originalError?: Error;

	constructor(message: string, originalError?: Error) {
		super(message, "NETWORK_ERROR");
		this.name = "NetworkError";
		this.originalError = originalError;
		Object.setPrototypeOf(this, NetworkError.prototype);
	}
}

/**
 * Map HTTP status code to appropriate error
 */
export function createErrorFromResponse(
	response: FamilySearchApiResponse<unknown>,
	context?: { resourceType?: string; resourceId?: string }
): FamilySearchError {
	const { statusCode, statusText, data } = response;

	// Extract error message from response data if available
	const errorMessage =
		(data as { error?: string })?.error ||
		(data as { message?: string })?.message ||
		statusText ||
		`HTTP ${statusCode}`;

	switch (statusCode) {
		case 401:
			return new AuthenticationError(
				`Authentication required: ${errorMessage}`,
				401
			);

		case 403:
			return new AuthenticationError(
				`Access forbidden: ${errorMessage}`,
				403
			);

		case 404:
			if (context?.resourceType && context?.resourceId) {
				return new NotFoundError(
					context.resourceType,
					context.resourceId
				);
			}
			return new FamilySearchError(
				`Resource not found: ${errorMessage}`,
				"NOT_FOUND"
			);

		case 400:
			return new ValidationError(
				`Invalid request: ${errorMessage}`,
				data
			);

		case 429: {
			const retryAfter = response.headers["retry-after"]
				? parseInt(response.headers["retry-after"], 10)
				: undefined;
			return new RateLimitError(
				`Rate limit exceeded: ${errorMessage}`,
				retryAfter
			);
		}

		case 500:
		case 502:
		case 503:
		case 504:
			return new ServerError(
				`Server error: ${errorMessage}`,
				statusCode
			);

		default:
			return new FamilySearchError(
				`API error (${statusCode}): ${errorMessage}`,
				"API_ERROR"
			);
	}
}

/**
 * Map network/fetch errors to NetworkError
 */
export function createNetworkError(error: unknown): NetworkError {
	if (error instanceof Error) {
		return new NetworkError(
			`Network request failed: ${error.message}`,
			error
		);
	}
	return new NetworkError("Network request failed");
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
	if (error instanceof RateLimitError) {
		return true;
	}
	if (error instanceof ServerError) {
		// Retry on 502, 503, 504 but not 500
		return error.statusCode >= 502;
	}
	if (error instanceof NetworkError) {
		return true;
	}
	return false;
}
