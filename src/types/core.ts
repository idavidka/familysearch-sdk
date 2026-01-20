/**
 * Core SDK Types
 * 
 * Environment configuration, SDK initialization, and base API types
 */

// ====================================
// Environment Configuration
// ====================================

/**
 * FamilySearch API environment
 */
export type FamilySearchEnvironment = "production" | "beta" | "integration";

/**
 * Environment-specific endpoint configuration
 */
export interface EnvironmentConfig {
	/** Identity server host for OAuth */
	identHost: string;
	/** Platform API host for data operations */
	platformHost: string;
}

// ====================================
// SDK Configuration
// ====================================

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
	/** Maximum requests per second (default: 10) */
	requestsPerSecond?: number;
	/** Maximum burst size (default: 20) */
	maxBurst?: number;
	/** Maximum retry attempts for 429 errors (default: 3) */
	maxRetries?: number;
	/** Initial backoff delay in ms (default: 1000) */
	initialBackoffMs?: number;
	/** Maximum backoff delay in ms (default: 30000) */
	maxBackoffMs?: number;
	/** Jitter factor (0-1) to add randomness to backoff delays (default: 0.3 = 30%) */
	jitterFactor?: number;
}

/**
 * SDK initialization options
 */
export interface FamilySearchSDKConfig {
	/** API environment (default: "integration") */
	environment?: FamilySearchEnvironment;
	/** OAuth access token */
	accessToken?: string;
	/** Application key for API requests */
	appKey?: string;
	/** Optional logger for debugging */
	logger?: SDKLogger;
	/** Optional rate limiter configuration */
	rateLimiter?: RateLimiterConfig;
}

/**
 * Logger interface for SDK debugging
 */
export interface SDKLogger {
	log: (message: string, ...args: unknown[]) => void;
	warn: (message: string, ...args: unknown[]) => void;
	error: (message: string, ...args: unknown[]) => void;
}

// ====================================
// API Response Types
// ====================================

/**
 * Generic API response wrapper
 */
export interface FamilySearchApiResponse<T> {
	/** Response data */
	data?: T;
	/** HTTP status code */
	statusCode: number;
	/** HTTP status text */
	statusText: string;
	/** Response headers */
	headers: Record<string, string>;
}

/**
 * API error with additional context
 */
export interface FamilySearchApiError extends Error {
	/** HTTP status code if available */
	statusCode?: number;
	/** Full response object */
	response?: FamilySearchApiResponse<unknown>;
}

// ====================================
// Progress Callback Types
// ====================================

/**
 * Progress callback for long operations
 */
export type ProgressCallback = (progress: {
	stage: string;
	current: number;
	total: number;
	percent: number;
}) => void;
