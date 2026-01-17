import { describe, it, expect, beforeEach } from "vitest";
import {
	FamilySearchError,
	AuthenticationError,
	NotFoundError,
	RateLimitError,
	ValidationError,
	ServerError,
	NetworkError,
	createErrorFromResponse,
	createNetworkError,
	isRetryableError,
} from "../errors";

describe("Error Handling", () => {
	describe("Error Classes", () => {
		it("should create FamilySearchError with code", () => {
			const error = new FamilySearchError("Test error", "TEST_CODE");
			expect(error.message).toBe("Test error");
			expect(error.code).toBe("TEST_CODE");
			expect(error.name).toBe("FamilySearchError");
		});

		it("should create AuthenticationError with status code", () => {
			const error = new AuthenticationError("Auth failed", 401);
			expect(error.message).toBe("Auth failed");
			expect(error.code).toBe("AUTHENTICATION_ERROR");
			expect(error.statusCode).toBe(401);
			expect(error.name).toBe("AuthenticationError");
		});

		it("should create NotFoundError with resource details", () => {
			const error = new NotFoundError("Person", "KWQS-BBQ");
			expect(error.message).toBe("Person not found: KWQS-BBQ");
			expect(error.code).toBe("NOT_FOUND");
			expect(error.resourceType).toBe("Person");
			expect(error.resourceId).toBe("KWQS-BBQ");
		});

		it("should create RateLimitError with retry after", () => {
			const error = new RateLimitError("Rate limit hit", 60);
			expect(error.message).toBe("Rate limit hit");
			expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
			expect(error.retryAfter).toBe(60);
		});

		it("should create ValidationError with details", () => {
			const details = { field: "birthDate", message: "Invalid date" };
			const error = new ValidationError("Validation failed", details);
			expect(error.message).toBe("Validation failed");
			expect(error.code).toBe("VALIDATION_ERROR");
			expect(error.details).toEqual(details);
		});

		it("should create ServerError with status code", () => {
			const error = new ServerError("Server error", 500);
			expect(error.message).toBe("Server error");
			expect(error.code).toBe("SERVER_ERROR");
			expect(error.statusCode).toBe(500);
		});

		it("should create NetworkError with original error", () => {
			const originalError = new Error("Connection failed");
			const error = new NetworkError("Network failed", originalError);
			expect(error.message).toBe("Network failed");
			expect(error.code).toBe("NETWORK_ERROR");
			expect(error.originalError).toBe(originalError);
		});
	});

	describe("createErrorFromResponse", () => {
		it("should create AuthenticationError for 401", () => {
			const response = {
				statusCode: 401,
				statusText: "Unauthorized",
				headers: {},
				data: { error: "Invalid token" },
			};

			const error = createErrorFromResponse(response);
			expect(error).toBeInstanceOf(AuthenticationError);
			expect(error.message).toContain("Authentication required");
		});

		it("should create AuthenticationError for 403", () => {
			const response = {
				statusCode: 403,
				statusText: "Forbidden",
				headers: {},
			};

			const error = createErrorFromResponse(response);
			expect(error).toBeInstanceOf(AuthenticationError);
			expect(error.message).toContain("Access forbidden");
		});

		it("should create NotFoundError for 404 with context", () => {
			const response = {
				statusCode: 404,
				statusText: "Not Found",
				headers: {},
			};

			const error = createErrorFromResponse(response, {
				resourceType: "Person",
				resourceId: "KWQS-BBQ",
			});
			expect(error).toBeInstanceOf(NotFoundError);
			expect((error as NotFoundError).resourceType).toBe("Person");
			expect((error as NotFoundError).resourceId).toBe("KWQS-BBQ");
		});

		it("should create ValidationError for 400", () => {
			const response = {
				statusCode: 400,
				statusText: "Bad Request",
				headers: {},
				data: { message: "Invalid input" },
			};

			const error = createErrorFromResponse(response);
			expect(error).toBeInstanceOf(ValidationError);
			expect(error.message).toContain("Invalid request");
		});

		it("should create RateLimitError for 429 with retry-after", () => {
			const response = {
				statusCode: 429,
				statusText: "Too Many Requests",
				headers: { "retry-after": "60" },
			};

			const error = createErrorFromResponse(response);
			expect(error).toBeInstanceOf(RateLimitError);
			expect((error as RateLimitError).retryAfter).toBe(60);
		});

		it("should create ServerError for 5xx", () => {
			const response = {
				statusCode: 500,
				statusText: "Internal Server Error",
				headers: {},
			};

			const error = createErrorFromResponse(response);
			expect(error).toBeInstanceOf(ServerError);
		});
	});

	describe("createNetworkError", () => {
		it("should wrap Error in NetworkError", () => {
			const originalError = new Error("Fetch failed");
			const error = createNetworkError(originalError);
			expect(error).toBeInstanceOf(NetworkError);
			expect(error.originalError).toBe(originalError);
		});

		it("should create NetworkError for non-Error objects", () => {
			const error = createNetworkError("string error");
			expect(error).toBeInstanceOf(NetworkError);
			expect(error.message).toBe("Network request failed");
		});
	});

	describe("isRetryableError", () => {
		it("should return true for RateLimitError", () => {
			const error = new RateLimitError("Rate limit");
			expect(isRetryableError(error)).toBe(true);
		});

		it("should return true for ServerError 502/503/504", () => {
			expect(isRetryableError(new ServerError("Bad Gateway", 502))).toBe(
				true
			);
			expect(
				isRetryableError(new ServerError("Service Unavailable", 503))
			).toBe(true);
			expect(
				isRetryableError(new ServerError("Gateway Timeout", 504))
			).toBe(true);
		});

		it("should return false for ServerError 500", () => {
			const error = new ServerError("Internal Server Error", 500);
			expect(isRetryableError(error)).toBe(false);
		});

		it("should return true for NetworkError", () => {
			const error = new NetworkError("Network failed");
			expect(isRetryableError(error)).toBe(true);
		});

		it("should return false for other errors", () => {
			expect(isRetryableError(new AuthenticationError("Auth", 401))).toBe(
				false
			);
			expect(isRetryableError(new NotFoundError("Person", "ID"))).toBe(
				false
			);
			expect(isRetryableError(new Error("Generic error"))).toBe(false);
		});
	});
});
