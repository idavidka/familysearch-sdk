/**
 * `fetch` header values must be ISO-8859-1 (ByteString). Anything outside
 * 0x00–0xFF (Hungarian ő/ű, CJK, emoji, …) throws before the request is sent.
 *
 * Latin-1 stays as-is. Other letters are decomposed (NFKD) to a Latin-1 base
 * when that exists; remaining code points become `?`.
 */
const isLatin1 = (value: string): boolean =>
	[...value].every((char) => char.charCodeAt(0) <= 0xff);

export const toLatin1HeaderValue = (value: string): string =>
	[...value]
		.map((char) => {
			if (char.charCodeAt(0) <= 0xff) {
				return char;
			}
			const stripped = char.normalize("NFKD").replace(/\p{M}/gu, "");
			return stripped && isLatin1(stripped) ? stripped : "?";
		})
		.join("");
