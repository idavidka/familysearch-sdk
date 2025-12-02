import { describe, it, expect } from "vitest";
import {
	generateOAuthState,
	buildAuthorizationUrl,
	getOAuthEndpoints,
	parseCallbackParams,
	getTokenStorageKey,
} from "../auth";

describe("OAuth utilities", () => {
	describe("generateOAuthState", () => {
		it("should generate a 64-character hex string", () => {
			const state = generateOAuthState();
			expect(state).toMatch(/^[0-9a-f]{64}$/);
		});

		it("should generate unique states", () => {
			const state1 = generateOAuthState();
			const state2 = generateOAuthState();
			expect(state1).not.toBe(state2);
		});
	});

	describe("getOAuthEndpoints", () => {
		it("should return production endpoints", () => {
			const endpoints = getOAuthEndpoints("production");
			expect(endpoints.authorization).toContain("ident.familysearch.org");
			expect(endpoints.token).toContain("ident.familysearch.org");
			expect(endpoints.currentUser).toContain("api.familysearch.org");
		});

		it("should return beta endpoints", () => {
			const endpoints = getOAuthEndpoints("beta");
			expect(endpoints.authorization).toContain("identbeta.familysearch.org");
			expect(endpoints.token).toContain("identbeta.familysearch.org");
			expect(endpoints.currentUser).toContain("apibeta.familysearch.org");
		});

		it("should return integration endpoints by default", () => {
			const endpoints = getOAuthEndpoints();
			expect(endpoints.authorization).toContain("identint.familysearch.org");
			expect(endpoints.token).toContain("identint.familysearch.org");
			expect(endpoints.currentUser).toContain("api-integ.familysearch.org");
		});
	});

	describe("buildAuthorizationUrl", () => {
		it("should build correct authorization URL", () => {
			const state = "test-state-123";
			const url = buildAuthorizationUrl(
				{
					clientId: "my-client-id",
					redirectUri: "https://example.com/callback",
					environment: "production",
				},
				state
			);

			expect(url).toContain("ident.familysearch.org");
			expect(url).toContain("response_type=code");
			expect(url).toContain("client_id=my-client-id");
			expect(url).toContain("redirect_uri=https%3A%2F%2Fexample.com%2Fcallback");
			expect(url).toContain("state=test-state-123");
		});

		it("should include scopes when provided", () => {
			const url = buildAuthorizationUrl(
				{
					clientId: "client",
					redirectUri: "https://example.com/callback",
				},
				"state",
				{ scopes: ["openid", "profile"] }
			);

			expect(url).toContain("scope=openid+profile");
		});
	});

	describe("parseCallbackParams", () => {
		it("should parse code and state from URL", () => {
			const params = parseCallbackParams(
				"https://example.com/callback?code=auth-code&state=state-123"
			);

			expect(params.code).toBe("auth-code");
			expect(params.state).toBe("state-123");
			expect(params.error).toBeUndefined();
		});

		it("should parse error from URL", () => {
			const params = parseCallbackParams(
				"https://example.com/callback?error=access_denied&error_description=User+denied"
			);

			expect(params.error).toBe("access_denied");
			expect(params.error_description).toBe("User denied");
			expect(params.code).toBeUndefined();
		});
	});

	describe("getTokenStorageKey", () => {
		it("should generate correct storage key", () => {
			expect(getTokenStorageKey("user123", "access")).toBe("fs_token_user123_access");
			expect(getTokenStorageKey("user123", "refresh")).toBe("fs_token_user123_refresh");
			expect(getTokenStorageKey("user123", "expires")).toBe("fs_token_user123_expires");
			expect(getTokenStorageKey("user123", "environment")).toBe("fs_token_user123_environment");
		});
	});
});
