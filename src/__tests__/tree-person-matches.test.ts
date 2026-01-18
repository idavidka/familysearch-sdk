import { describe, it, expect, beforeEach, vi } from "vitest";
import { FamilySearchSDK } from "../client";
import type { TreePersonMatchesResponse } from "../types";

// Mock global fetch
global.fetch = vi.fn();

describe("Tree Person Matches API", () => {
	let sdk: FamilySearchSDK;

	beforeEach(() => {
		sdk = new FamilySearchSDK({
			environment: "integration",
			accessToken: "test-access-token",
		});
		vi.clearAllMocks();
	});

	describe("getTreePersonMatches", () => {
		it("should fetch matches for a valid person ID", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [
					{
						id: "match-1",
						about: "https://example.com/record1",
						titles: [{ value: "1900 US Census Record" }],
						citations: [{ value: "US Census, 1900, County Records" }],
						resourceType: "http://gedcomx.org/DigitalArtifact",
					},
					{
						id: "match-2",
						about: "https://example.com/record2",
						titles: [{ value: "Birth Certificate" }],
						citations: [{ value: "Birth certificate, 1880" }],
						resourceType: "http://gedcomx.org/PhysicalArtifact",
					},
				],
				entries: [
					{
						id: "entry-1",
						title: "Match 1",
						content: {
							score: 95,
						},
					},
					{
						id: "entry-2",
						title: "Match 2",
						content: {
							score: 87,
						},
					},
				],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/persons/KWQS-BBQ/matches",
				expect.objectContaining({
					method: "GET",
					headers: expect.objectContaining({
						Accept: "application/json",
						Authorization: "Bearer test-access-token",
					}),
				})
			);

			expect(result).toEqual(mockResponse);
			expect(result?.sourceDescriptions).toHaveLength(2);
			expect(result?.entries).toHaveLength(2);
		});

		it("should fetch matches with query parameters", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [],
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			await sdk.getTreePersonMatches("KWQS-BBQ", {
				status: "pending",
				collection: "census",
				count: 20,
				start: 0,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/persons/KWQS-BBQ/matches?status=pending&collection=census&count=20&start=0",
				expect.anything()
			);
		});

		it("should return null for non-existent person ID (404)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: "Not Found",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Person not found" }),
			});

			const result = await sdk.getTreePersonMatches("INVALID-ID");

			expect(result).toBeNull();
		});

		it("should return null when person has no matches", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [],
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(result).toEqual(mockResponse);
			expect(result?.sourceDescriptions).toHaveLength(0);
		});

		it("should return null for unauthorized request (401)", async () => {
			const unauthorizedSDK = new FamilySearchSDK({
				environment: "integration",
			});

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Unauthorized" }),
			});

			const result = await unauthorizedSDK.getTreePersonMatches("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should handle network errors gracefully", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
				new Error("Network error")
			);

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should handle API rate limiting (429)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 429,
				statusText: "Too Many Requests",
				headers: new Headers({
					"content-type": "application/json",
					"retry-after": "60",
				}),
				json: async () => ({ error: "Rate limit exceeded" }),
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should handle server errors (500)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Server error" }),
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should work with different environments", async () => {
			const prodSdk = new FamilySearchSDK({
				environment: "production",
				accessToken: "prod-token",
			});

			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			await prodSdk.getTreePersonMatches("TEST-123");

			expect(fetch).toHaveBeenCalledWith(
				"https://api.familysearch.org/platform/tree/persons/TEST-123/matches",
				expect.anything()
			);
		});

		it("should handle malformed JSON responses", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => {
					throw new Error("Invalid JSON");
				},
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			// Should still complete but with null data
			expect(result).toBeNull();
		});

		it("should support partial query parameters", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			await sdk.getTreePersonMatches("KWQS-BBQ", {
				status: "pending",
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/persons/KWQS-BBQ/matches?status=pending",
				expect.anything()
			);
		});

		it("should handle match entries with scores", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [
					{
						id: "match-1",
						titles: [{ value: "Census Record" }],
					},
				],
				entries: [
					{
						id: "entry-1",
						title: "High Confidence Match",
						content: {
							score: 98,
						},
					},
				],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(result?.entries?.[0]?.content?.score).toBe(98);
			expect(result?.entries?.[0]?.title).toBe("High Confidence Match");
		});

		it("should handle empty response", async () => {
			const mockResponse: TreePersonMatchesResponse = {};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const result = await sdk.getTreePersonMatches("KWQS-BBQ");

			expect(result).toEqual(mockResponse);
		});

		it("should handle beta environment", async () => {
			const betaSdk = new FamilySearchSDK({
				environment: "beta",
				accessToken: "beta-token",
			});

			const mockResponse: TreePersonMatchesResponse = {
				sourceDescriptions: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			await betaSdk.getTreePersonMatches("TEST-123");

			expect(fetch).toHaveBeenCalledWith(
				"https://apibeta.familysearch.org/platform/tree/persons/TEST-123/matches",
				expect.anything()
			);
		});
	});
});
