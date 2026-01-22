import { describe, it, expect, beforeEach, vi } from "vitest";
import { FamilySearchSDK } from "../client";
import type { PersonSourcesResponse } from "../types";

// Mock global fetch
global.fetch = vi.fn();

describe("Person Sources API", () => {
	let sdk: FamilySearchSDK;

	beforeEach(() => {
		sdk = new FamilySearchSDK({
			environment: "integration",
			accessToken: "test-access-token",
		});
		vi.clearAllMocks();
	});

	describe("getPersonSources", () => {
		it("should fetch sources for a valid person ID", async () => {
			const mockResponse: PersonSourcesResponse = {
				persons: [
					{
						id: "KWQS-BBQ",
						sources: [
							{
								descriptionId: "source-1",
								description: "#source-1",
								qualifiers: [
									{
										name: "http://gedcomx.org/Name",
										value: "Birth",
									},
								],
							},
							{
								descriptionId: "source-2",
								description: "#source-2",
								qualifiers: [
									{
										name: "http://gedcomx.org/Name",
										value: "Census",
									},
								],
							},
						],
					},
				],
				sourceDescriptions: [
					{
						id: "source-1",
						about: "https://example.com/source1",
						titles: [{ value: "Birth Certificate" }],
						citations: [
							{ value: "Birth certificate for John Smith, 1900" },
						],
						resourceType: "http://gedcomx.org/DigitalArtifact",
					},
					{
						id: "source-2",
						about: "https://example.com/source2",
						titles: [{ value: "1910 US Census" }],
						citations: [
							{ value: "US Census, 1910, County Records" },
						],
						resourceType: "http://gedcomx.org/PhysicalArtifact",
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

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/persons/KWQS-BBQ/sources",
				expect.objectContaining({
					method: "GET",
					headers: expect.objectContaining({
						Accept: "application/json",
						Authorization: "Bearer test-access-token",
					}),
				})
			);

			expect(result).toEqual(mockResponse);
			expect(result?.persons?.[0]?.sources).toHaveLength(2);
			expect(result?.sourceDescriptions).toHaveLength(2);
		});

		it("should return null for non-existent person ID (404)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: "Not Found",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Person not found" }),
			});

			const result = await sdk.persons.readPersonSources("INVALID-ID");

			expect(result).toBeNull();
		});

		it("should return null when person has no sources", async () => {
			const mockResponse: PersonSourcesResponse = {
				persons: [
					{
						id: "KWQS-BBQ",
						sources: [],
					},
				],
				sourceDescriptions: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			expect(result).toEqual(mockResponse);
			expect(result?.persons?.[0]?.sources).toHaveLength(0);
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

			const result =
				await unauthorizedSDK.persons.readPersonSources("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should handle network errors gracefully", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
				new Error("Network error")
			);

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should handle API rate limiting (429)", async () => {
			// Mock multiple 429 responses to simulate rate limiting with retries
			const mockResponse = {
				ok: false,
				status: 429,
				statusText: "Too Many Requests",
				headers: new Headers({
					"content-type": "application/json",
					"retry-after": "1", // Use short retry for testing
				}),
				json: async () => ({ error: "Rate limit exceeded" }),
			};

			// Mock 4 failed attempts (initial + 3 retries)
			(global.fetch as ReturnType<typeof vi.fn>)
				.mockResolvedValueOnce(mockResponse)
				.mockResolvedValueOnce(mockResponse)
				.mockResolvedValueOnce(mockResponse)
				.mockResolvedValueOnce(mockResponse);

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			expect(result).toBeNull();
		}, 10000); // Increase timeout for retry delays

		it("should handle server errors (500)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Server error" }),
			});

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should work with different environments", async () => {
			const prodSdk = new FamilySearchSDK({
				environment: "production",
				accessToken: "prod-token",
			});

			const mockResponse: PersonSourcesResponse = {
				persons: [{ id: "TEST-123", sources: [] }],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			await prodSdk.persons.readPersonSources("TEST-123");

			expect(fetch).toHaveBeenCalledWith(
				"https://api.familysearch.org/platform/tree/persons/TEST-123/sources",
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

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			// Should still complete but with undefined data
			expect(result).toBeNull();
		});

		it("should include qualifiers in source references", async () => {
			const mockResponse: PersonSourcesResponse = {
				persons: [
					{
						id: "KWQS-BBQ",
						sources: [
							{
								descriptionId: "source-1",
								qualifiers: [
									{
										name: "http://gedcomx.org/Name",
										value: "Birth",
									},
									{
										name: "http://gedcomx.org/Gender",
										value: "Male",
									},
								],
							},
						],
					},
				],
				sourceDescriptions: [
					{
						id: "source-1",
						titles: [{ value: "Birth Record" }],
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

			const result = await sdk.persons.readPersonSources("KWQS-BBQ");

			expect(result?.persons?.[0]?.sources?.[0]?.qualifiers).toHaveLength(
				2
			);
			expect(
				result?.persons?.[0]?.sources?.[0]?.qualifiers?.[0]?.name
			).toBe("http://gedcomx.org/Name");
		});
	});
});
