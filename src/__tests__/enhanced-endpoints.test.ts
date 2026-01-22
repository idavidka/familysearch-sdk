import { describe, it, expect, beforeEach, vi } from "vitest";
import { FamilySearchSDK } from "../client";

// Mock global fetch
global.fetch = vi.fn();

describe("Enhanced API Endpoints", () => {
	let sdk: FamilySearchSDK;

	beforeEach(() => {
		sdk = new FamilySearchSDK({
			environment: "integration",
			accessToken: "test-token",
		});
		vi.clearAllMocks();
	});

	describe("getPersonDiscussions", () => {
		it("should fetch discussions for a valid person ID", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					discussions: [
						{
							id: "DISC-001",
							title: "Birth Date Question",
							details: "When was John born?",
							numberOfComments: 3,
						},
					],
				}),
			});

			const result = await sdk.persons.readPersonDiscussions("KWQS-BBQ");

			expect(result).not.toBeNull();
			expect(result?.discussions).toHaveLength(1);
			expect(result?.discussions?.[0].id).toBe("DISC-001");
			expect(result?.discussions?.[0].title).toBe("Birth Date Question");
		});

		it("should return null for non-existent person ID (404)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: "Not Found",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Person not found" }),
			});

			const result =
				await sdk.persons.readPersonDiscussions("INVALID-ID");

			expect(result).toBeNull();
		});

		it("should return null when person has no discussions", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					discussions: [],
				}),
			});

			const result = await sdk.persons.readPersonDiscussions("KWQS-BBQ");

			expect(result).not.toBeNull();
			expect(result?.discussions).toHaveLength(0);
		});
	});

	describe("getPersonPortraits", () => {
		it("should fetch portraits for a valid person ID", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					sourceDescriptions: [
						{
							id: "MEM-001",
							about: "https://familysearch.org/photos/123",
							mediaType: "image/jpeg",
							resourceType: "http://gedcomx.org/DigitalArtifact",
							titles: [{ value: "John's Portrait" }],
						},
					],
				}),
			});

			const result = await sdk.persons.readPersonPortraits("KWQS-BBQ");

			expect(result).not.toBeNull();
			expect(result?.sourceDescriptions).toHaveLength(1);
			expect(result?.sourceDescriptions?.[0].id).toBe("MEM-001");
			expect(result?.sourceDescriptions?.[0].mediaType).toBe(
				"image/jpeg"
			);
		});

		it("should return null for unauthorized request (401)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 401,
				statusText: "Unauthorized",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Authentication required" }),
			});

			const result = await sdk.persons.readPersonPortraits("KWQS-BBQ");

			expect(result).toBeNull();
		});
	});

	describe("getPersonChangeHistory", () => {
		it("should fetch change history for a valid person ID", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					entries: [
						{
							id: "CHANGE-001",
							title: "Birth Date Added",
							updated: 1609459200000,
							changeInfo: [
								{
									operation: "Create",
									objectType: "Fact",
									objectModifier: "Birth",
								},
							],
						},
					],
				}),
			});

			const result =
				await sdk.persons.readPersonChangeHistory("KWQS-BBQ");

			expect(result).not.toBeNull();
			expect(result?.entries).toHaveLength(1);
			expect(result?.entries?.[0].id).toBe("CHANGE-001");
			expect(result?.entries?.[0].title).toBe("Birth Date Added");
		});

		it("should return null for server error (500)", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Server error" }),
			});

			const result =
				await sdk.persons.readPersonChangeHistory("KWQS-BBQ");

			expect(result).toBeNull();
		});

		it("should return empty entries when person has no changes", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					entries: [],
				}),
			});

			const result =
				await sdk.persons.readPersonChangeHistory("KWQS-BBQ");

			expect(result).not.toBeNull();
			expect(result?.entries).toHaveLength(0);
		});
	});
});
