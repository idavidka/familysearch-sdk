import { describe, it, expect } from "vitest";
import { toLatin1HeaderValue } from "../utils/headers";

describe("toLatin1HeaderValue", () => {
	it("leaves Latin-1 text unchanged", () => {
		expect(toLatin1HeaderValue("Corrected birth date")).toBe(
			"Corrected birth date"
		);
	});

	it("decomposes Hungarian letters to a Latin-1 base", () => {
		expect(toLatin1HeaderValue("Születési dátum")).toBe("Szuletesi datum");
	});

	it("strips CR, LF, and NUL so a reason cannot split the header", () => {
		expect(toLatin1HeaderValue("ok\r\nX-Injected: 1\0")).toBe(
			"okX-Injected: 1"
		);
	});
});
