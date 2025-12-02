import { describe, it, expect, beforeEach } from "vitest";
import {
	FamilySearchSDK,
	createFamilySearchSDK,
	initFamilySearchSDK,
	getFamilySearchSDK,
	resetFamilySearchSDK,
	ENVIRONMENT_CONFIGS,
} from "../client";

describe("FamilySearchSDK", () => {
	beforeEach(() => {
		resetFamilySearchSDK();
	});

	describe("constructor", () => {
		it("should create SDK with default environment", () => {
			const sdk = new FamilySearchSDK();
			expect(sdk.getEnvironment()).toBe("integration");
		});

		it("should create SDK with specified environment", () => {
			const sdk = new FamilySearchSDK({ environment: "production" });
			expect(sdk.getEnvironment()).toBe("production");
		});

		it("should create SDK with access token", () => {
			const sdk = new FamilySearchSDK({ accessToken: "test-token" });
			expect(sdk.getAccessToken()).toBe("test-token");
		});
	});

	describe("access token management", () => {
		it("should set and get access token", () => {
			const sdk = new FamilySearchSDK();
			expect(sdk.getAccessToken()).toBeNull();

			sdk.setAccessToken("new-token");
			expect(sdk.getAccessToken()).toBe("new-token");
		});

		it("should clear access token", () => {
			const sdk = new FamilySearchSDK({ accessToken: "test-token" });
			expect(sdk.getAccessToken()).toBe("test-token");

			sdk.clearAccessToken();
			expect(sdk.getAccessToken()).toBeNull();
		});

		it("should check if SDK has access token", () => {
			const sdk = new FamilySearchSDK();
			expect(sdk.hasAccessToken()).toBe(false);

			sdk.setAccessToken("token");
			expect(sdk.hasAccessToken()).toBe(true);
		});
	});

	describe("environment configuration", () => {
		it("should return correct config for production", () => {
			const sdk = new FamilySearchSDK({ environment: "production" });
			const config = sdk.getConfig();

			expect(config.identHost).toBe("https://ident.familysearch.org");
			expect(config.platformHost).toBe("https://api.familysearch.org");
		});

		it("should return correct config for beta", () => {
			const sdk = new FamilySearchSDK({ environment: "beta" });
			const config = sdk.getConfig();

			expect(config.identHost).toBe("https://identbeta.familysearch.org");
			expect(config.platformHost).toBe("https://apibeta.familysearch.org");
		});

		it("should return correct config for integration", () => {
			const sdk = new FamilySearchSDK({ environment: "integration" });
			const config = sdk.getConfig();

			expect(config.identHost).toBe("https://identint.familysearch.org");
			expect(config.platformHost).toBe("https://api-integ.familysearch.org");
		});
	});
});

describe("singleton management", () => {
	beforeEach(() => {
		resetFamilySearchSDK();
	});

	it("should create singleton with initFamilySearchSDK", () => {
		const sdk = initFamilySearchSDK({ environment: "production" });
		expect(sdk.getEnvironment()).toBe("production");
	});

	it("should return same instance with getFamilySearchSDK", () => {
		const sdk1 = initFamilySearchSDK({ accessToken: "token1" });
		const sdk2 = getFamilySearchSDK();

		expect(sdk1).toBe(sdk2);
		expect(sdk2.getAccessToken()).toBe("token1");
	});

	it("should update token on existing instance", () => {
		initFamilySearchSDK({ accessToken: "token1" });
		initFamilySearchSDK({ accessToken: "token2" });

		const sdk = getFamilySearchSDK();
		expect(sdk.getAccessToken()).toBe("token2");
	});

	it("should create new instance when environment changes", () => {
		const sdk1 = initFamilySearchSDK({ environment: "integration" });
		const sdk2 = initFamilySearchSDK({ environment: "production" });

		expect(sdk1).not.toBe(sdk2);
		expect(sdk2.getEnvironment()).toBe("production");
	});

	it("should create new instance with createFamilySearchSDK", () => {
		const sdk1 = createFamilySearchSDK({ environment: "production" });
		const sdk2 = createFamilySearchSDK({ environment: "beta" });

		expect(sdk1).not.toBe(sdk2);
		expect(sdk1.getEnvironment()).toBe("production");
		expect(sdk2.getEnvironment()).toBe("beta");
	});
});

describe("ENVIRONMENT_CONFIGS", () => {
	it("should export all environment configs", () => {
		expect(ENVIRONMENT_CONFIGS).toHaveProperty("production");
		expect(ENVIRONMENT_CONFIGS).toHaveProperty("beta");
		expect(ENVIRONMENT_CONFIGS).toHaveProperty("integration");
	});

	it("should have correct structure for each environment", () => {
		for (const env of ["production", "beta", "integration"] as const) {
			expect(ENVIRONMENT_CONFIGS[env]).toHaveProperty("identHost");
			expect(ENVIRONMENT_CONFIGS[env]).toHaveProperty("platformHost");
		}
	});
});
