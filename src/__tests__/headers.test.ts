import { describe, expect, it } from "vitest";

import { toLatin1HeaderValue } from "../utils/headers";

describe("toLatin1HeaderValue", () => {
	it("keeps Latin-1 letters and strips extra marks from the rest", () => {
		expect(toLatin1HeaderValue("Születési hely pótlása")).toBe(
			"Születési hely potlása"
		);
		expect(toLatin1HeaderValue("bővítés űr")).toBe("bovítés ur");
		expect(toLatin1HeaderValue("Angéla Láng")).toBe("Angéla Láng");
	});

	it("replaces scripts with no Latin-1 base with ?", () => {
		expect(toLatin1HeaderValue("東京 tree")).toBe("?? tree");
	});
});
