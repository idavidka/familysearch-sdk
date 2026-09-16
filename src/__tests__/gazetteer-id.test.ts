import { describe, expect, it } from "vitest";
import {
	extractGazetteerPlaceId,
	familySearchResearchPlaceUrl,
	numericPlaceIdFromRef,
	pickBestPlaceSearchResult,
} from "../places/gazetteer-id";

describe("numericPlaceIdFromRef", () => {
	it("extracts the Place ID from a Places authority URL", () => {
		expect(
			numericPlaceIdFromRef(
				"http://api.familysearch.org/platform/places/3410741"
			)
		).toBe("3410741");
	});

	it("ignores description URLs and ARK identifiers", () => {
		expect(
			numericPlaceIdFromRef(
				"https://api.familysearch.org/platform/places/description/5194"
			)
		).toBeUndefined();
		expect(
			numericPlaceIdFromRef("https://familysearch.org/ark:/61903/4:1:KW8W")
		).toBeUndefined();
	});
});

describe("extractGazetteerPlaceId", () => {
	it("prefers the Persistent identifier over the description id", () => {
		expect(
			extractGazetteerPlaceId({
				id: "5194",
				identifiers: {
					"http://gedcomx.org/Persistent": [
						"http://api.familysearch.org/platform/places/3410741",
					],
				},
			})
		).toBe("3410741");
	});

	it("falls back to place.place description", () => {
		expect(
			extractGazetteerPlaceId({
				id: "388405",
				place: {
					description:
						"https://api.familysearch.org/platform/places/3410741",
				},
			})
		).toBe("3410741");
	});

	it("does not treat the description id as a Place id", () => {
		expect(extractGazetteerPlaceId({ id: "5194" })).toBeUndefined();
	});
});

describe("familySearchResearchPlaceUrl", () => {
	it("builds a focusedId URL from the gazetteer Place ID", () => {
		expect(familySearchResearchPlaceUrl("3410741")).toBe(
			"https://www.familysearch.org/en/research/places/?focusedId=3410741"
		);
	});
});

describe("pickBestPlaceSearchResult", () => {
	it("prefers a result whose name matches the town in the query", () => {
		const picked = pickBestPlaceSearchResult(
			[
				{
					name: "Szent-Domokos",
					fullName: "Szent-Domokos, Csík, Hungary",
				},
				{
					name: "Sândominic",
					fullName: "Sândominic, Harghita, Romania",
				},
			],
			"Sândominic, Ciuc, Romania"
		);
		expect(picked?.name).toBe("Sândominic");
	});
});
