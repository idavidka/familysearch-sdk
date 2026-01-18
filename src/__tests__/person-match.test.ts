import { describe, it, expect, beforeEach, vi } from "vitest";
import { FamilySearchSDK } from "../client";
import type { TreePersonMatchesResponse, PersonMatchInput } from "../types";

// Mock global fetch
global.fetch = vi.fn();

describe("Person Match API (External GEDCOM)", () => {
	let sdk: FamilySearchSDK;

	beforeEach(() => {
		sdk = new FamilySearchSDK({
			environment: "integration",
			accessToken: "test-access-token",
		});
		vi.clearAllMocks();
	});

	describe("matchPerson", () => {
		it("should match person with basic name and dates", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [
					{
						id: "entry-1",
						title: "John Smith",
						content: {
							score: 95,
							confidence: 4,
							gedcomx: {
								persons: [
									{
										id: "KWQS-BBQ",
										names: [
											{
												nameForms: [
													{
														fullText: "John Smith",
														parts: [
															{ type: "http://gedcomx.org/Given", value: "John" },
															{ type: "http://gedcomx.org/Surname", value: "Smith" },
														],
													},
												],
											},
										],
										display: {
											name: "John Smith",
											birthDate: "1850",
											birthPlace: "London, England",
										},
									},
								],
							},
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

			const person: PersonMatchInput = {
				givenName: "John",
				familyName: "Smith",
				birthDate: "1850",
				birthPlace: "London, England",
			};

			const result = await sdk.matchPerson(person);

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/matches",
				expect.objectContaining({
					method: "POST",
					headers: expect.objectContaining({
						Accept: "application/json",
						Authorization: "Bearer test-access-token",
						"Content-Type": "application/json",
					}),
				})
			);

			// Verify the body structure
			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			expect(body.persons[0].names[0].nameForms[0].parts[0].value).toBe("John");
			expect(body.persons[0].names[0].nameForms[0].parts[1].value).toBe("Smith");
			expect(body.persons[0].facts[0].type).toBe("http://gedcomx.org/Birth");

			expect(result).toEqual(mockResponse);
			expect(result?.entries).toHaveLength(1);
			expect(result?.entries?.[0]?.content?.score).toBe(95);
		});

		it("should match person with full name", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				fullName: "Mary Elizabeth Jones",
				birthDate: "15 March 1875",
				birthPlace: "New York, New York, USA",
			};

			const result = await sdk.matchPerson(person);

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/matches",
				expect.anything()
			);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			expect(body.persons[0].names[0].nameForms[0].fullText).toBe("Mary Elizabeth Jones");
		});

		it("should match person with gender information", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Jane",
				familyName: "Doe",
				gender: "Female",
				birthDate: "1880",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			expect(body.persons[0].gender.type).toBe("http://gedcomx.org/Female");
		});

		it("should match person with birth and death information", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [
					{
						id: "entry-1",
						title: "Match 1",
						content: {
							score: 88,
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

			const person: PersonMatchInput = {
				givenName: "Robert",
				familyName: "Johnson",
				birthDate: "1825",
				birthPlace: "Boston, Massachusetts",
				deathDate: "1890",
				deathPlace: "Chicago, Illinois",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			const facts = body.persons[0].facts;
			
			expect(facts).toHaveLength(2);
			expect(facts[0].type).toBe("http://gedcomx.org/Birth");
			expect(facts[0].date.original).toBe("1825");
			expect(facts[0].place.original).toBe("Boston, Massachusetts");
			expect(facts[1].type).toBe("http://gedcomx.org/Death");
			expect(facts[1].date.original).toBe("1890");
			expect(facts[1].place.original).toBe("Chicago, Illinois");
		});

		it("should match person with marriage information", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "William",
				familyName: "Brown",
				marriageDate: "1850",
				marriagePlace: "London, England",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			const marriageFact = body.persons[0].facts.find(
				(f: { type: string }) => f.type === "http://gedcomx.org/Marriage"
			);
			
			expect(marriageFact).toBeDefined();
			expect(marriageFact.date.original).toBe("1850");
			expect(marriageFact.place.original).toBe("London, England");
		});

		it("should handle collection filter option", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Thomas",
				familyName: "Anderson",
			};

			await sdk.matchPerson(person, {
				collection: "census",
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/matches?collection=census",
				expect.anything()
			);
		});

		it("should handle count option", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Emma",
				familyName: "Wilson",
			};

			await sdk.matchPerson(person, {
				count: 50,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/matches?count=50",
				expect.anything()
			);
		});

		it("should handle multiple options", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "George",
				familyName: "Taylor",
			};

			await sdk.matchPerson(person, {
				collection: "census",
				count: 30,
			});

			expect(fetch).toHaveBeenCalledWith(
				"https://api-integ.familysearch.org/platform/tree/matches?collection=census&count=30",
				expect.anything()
			);
		});

		it("should return null for API errors", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ error: "Invalid request" }),
			});

			const person: PersonMatchInput = {
				givenName: "Invalid",
			};

			const result = await sdk.matchPerson(person);

			expect(result).toBeNull();
		});

		it("should return null for network errors", async () => {
			(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
				new Error("Network error")
			);

			const person: PersonMatchInput = {
				givenName: "Test",
				familyName: "User",
			};

			const result = await sdk.matchPerson(person);

			expect(result).toBeNull();
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

			const person: PersonMatchInput = {
				givenName: "John",
				familyName: "Doe",
			};

			const result = await unauthorizedSDK.matchPerson(person);

			expect(result).toBeNull();
		});

		it("should work with production environment", async () => {
			const prodSdk = new FamilySearchSDK({
				environment: "production",
				accessToken: "prod-token",
			});

			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Test",
				familyName: "Person",
			};

			await prodSdk.matchPerson(person);

			expect(fetch).toHaveBeenCalledWith(
				"https://api.familysearch.org/platform/tree/matches",
				expect.anything()
			);
		});

		it("should work with beta environment", async () => {
			const betaSdk = new FamilySearchSDK({
				environment: "beta",
				accessToken: "beta-token",
			});

			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Beta",
				familyName: "Test",
			};

			await betaSdk.matchPerson(person);

			expect(fetch).toHaveBeenCalledWith(
				"https://apibeta.familysearch.org/platform/tree/matches",
				expect.anything()
			);
		});

		it("should handle minimal person data", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "John",
			};

			const result = await sdk.matchPerson(person);

			expect(result).toEqual(mockResponse);
			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			expect(body.persons[0].names[0].nameForms[0].parts[0].value).toBe("John");
		});

		it("should handle person with only family name", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				familyName: "Smith",
				birthDate: "1800",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			expect(body.persons[0].names[0].nameForms[0].parts[0].value).toBe("Smith");
		});

		it("should handle person with only dates (no places)", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Alice",
				familyName: "Cooper",
				birthDate: "1830",
				deathDate: "1900",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			const facts = body.persons[0].facts;
			
			expect(facts[0].date).toBeDefined();
			expect(facts[0].place).toBeUndefined();
			expect(facts[1].date).toBeDefined();
			expect(facts[1].place).toBeUndefined();
		});

		it("should handle person with only places (no dates)", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Bob",
				familyName: "Miller",
				birthPlace: "Paris, France",
				deathPlace: "Berlin, Germany",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			const facts = body.persons[0].facts;
			
			expect(facts[0].date).toBeUndefined();
			expect(facts[0].place).toBeDefined();
			expect(facts[1].date).toBeUndefined();
			expect(facts[1].place).toBeDefined();
		});

		it("should handle comprehensive person data with all fields", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [
					{
						id: "comprehensive-match",
						title: "High Quality Match",
						content: {
							score: 99,
							confidence: 5,
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

			const person: PersonMatchInput = {
				givenName: "Elizabeth",
				familyName: "Thompson",
				gender: "Female",
				birthDate: "12 April 1845",
				birthPlace: "Liverpool, Lancashire, England",
				deathDate: "3 November 1920",
				deathPlace: "Manchester, Lancashire, England",
				marriageDate: "15 June 1865",
				marriagePlace: "Chester, Cheshire, England",
			};

			const result = await sdk.matchPerson(person);

			expect(result?.entries?.[0]?.content?.score).toBe(99);
			
			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			const personData = body.persons[0];
			
			expect(personData.names[0].nameForms[0].parts).toHaveLength(2);
			expect(personData.gender.type).toBe("http://gedcomx.org/Female");
			expect(personData.facts).toHaveLength(3);
			expect(personData.facts[0].type).toBe("http://gedcomx.org/Birth");
			expect(personData.facts[1].type).toBe("http://gedcomx.org/Death");
			expect(personData.facts[2].type).toBe("http://gedcomx.org/Marriage");
		});

		it("should handle empty person data gracefully", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			
			// Should still create a persons array with an empty person object
			expect(body.persons).toHaveLength(1);
		});

		it("should normalize gender to proper case", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Jane",
				familyName: "Doe",
				gender: "female", // lowercase
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			// Should normalize to proper case
			expect(body.persons[0].gender.type).toBe("http://gedcomx.org/Female");
		});

		it("should ignore invalid gender values", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "Test",
				familyName: "Person",
				gender: "Invalid", // invalid value
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			// Gender should not be included
			expect(body.persons[0].gender).toBeUndefined();
		});

		it("should handle name with only familyName without extra spaces", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				familyName: "Smith",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			// Should not have leading/trailing spaces
			expect(body.persons[0].names[0].nameForms[0].fullText).toBe("Smith");
		});

		it("should handle name with only givenName without extra spaces", async () => {
			const mockResponse: TreePersonMatchesResponse = {
				entries: [],
			};

			(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
				ok: true,
				status: 200,
				statusText: "OK",
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => mockResponse,
			});

			const person: PersonMatchInput = {
				givenName: "John",
			};

			await sdk.matchPerson(person);

			const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
			const body = JSON.parse(callArgs[1].body);
			// Should not have leading/trailing spaces
			expect(body.persons[0].names[0].nameForms[0].fullText).toBe("John");
		});
	});
});
