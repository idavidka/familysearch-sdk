import { describe, it, expect } from "vitest";
import { toLatin1HeaderValue } from "../utils/headers";

describe("toLatin1HeaderValue", () => {
	it("leaves Latin-1 text unchanged", () => {
		expect(toLatin1HeaderValue("Corrected birth date")).toBe(
			"Corrected birth date"
		);
	});

	it("keeps Latin-1 accents and decomposes letters outside Latin-1", () => {
		expect(toLatin1HeaderValue("Születési dátum")).toBe("Születési dátum");
		expect(toLatin1HeaderValue("Őrségi gyűjtés")).toBe("Orségi gyujtés");
	});

	it("strips CR, LF, and NUL so a reason cannot split the header", () => {
		expect(toLatin1HeaderValue("ok\r\nX-Injected: 1\0")).toBe(
			"okX-Injected: 1"
		);
	});
});
