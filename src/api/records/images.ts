/**
 * FamilySearch Historical Records — image resolution.
 *
 * Person sources usually only carry an indexed-persona ark (`1:1:`).
 * Flow:
 *   1:1 persona → GET /platform/records/personas/{1:1:…}
 *     → DigitalArtifact about = 3:1:… ark
 *   → prefer links that end in dist.jpg / image.*
 *   → else DAS: /service/records/storage/dascloud/das/v2/{3:1:…}/dist.jpg
 *
 * Bare DAS artifact URLs (no /dist.jpg) often return `text/plain` with a
 * `dgs:…` id — those must NOT be treated as images.
 *
 * Contract-restricted collections return 403/empty — callers keep WWW only.
 */

import type { FamilySearchSDK } from "../../client";

export type GedcomxLinkMap = Record<
	string,
	{ href?: string; template?: string } | undefined
>;

export type GedcomxSourceDescription = {
	id?: string;
	about?: string;
	mediaType?: string;
	resourceType?: string;
	links?: GedcomxLinkMap;
};

export type GedcomxDocument = {
	sourceDescriptions?: GedcomxSourceDescription[];
	links?: GedcomxLinkMap;
	documents?: GedcomxDocument[];
	persons?: Array<{ links?: GedcomxLinkMap }>;
};

const IMAGE_FILE_RE = /\.(jpe?g|png|gif|webp|tif{1,2}|pdf)(\?|$)/i;
const DIST_JPG_RE = /\/dist\.jpg(\?|$)/i;
const THUMB_JPG_RE = /\/thumb\d+s?\.jpg(\?|$)/i;
const MEMORIES_ARTIFACT_RE = /\/platform\/memories\/artifacts\//i;
const DAS_STORAGE_RE = /\/service\/records\/storage\//i;

/** FS record ids are path-safe (`3:1:S3HY-…`); encoding colons can 404 some hosts. */
const pathId = (name: string): string => name;

/**
 * True when the URL looks like a binary artifact (JPEG/PDF), not an ark HTML
 * page and not a bare DAS container that returns `dgs:…` as text/plain.
 */
export function isDownloadableRecordImageUrl(url: string | undefined): boolean {
	if (!url) {
		return false;
	}
	if (MEMORIES_ARTIFACT_RE.test(url)) {
		return true;
	}
	if (DIST_JPG_RE.test(url) || THUMB_JPG_RE.test(url) || IMAGE_FILE_RE.test(url)) {
		return true;
	}
	// Bare storage paths without a file suffix resolve to DGS text — reject.
	if (DAS_STORAGE_RE.test(url)) {
		return false;
	}
	return false;
}

/** Prefer high-res / image / artifact links; fall back to `about` when binary-like. */
export function pickDownloadableImageHref(
	desc: GedcomxSourceDescription | undefined,
	links?: GedcomxLinkMap
): string | undefined {
	const map = { ...links, ...desc?.links };
	const candidates = [
		map?.["image-high-res"]?.href,
		map?.image?.href,
		map?.artifact?.href,
		map?.content?.href,
		map?.["image-thumbnail"]?.href,
		desc?.about,
	];
	for (const href of candidates) {
		if (href && isDownloadableRecordImageUrl(href)) {
			return href;
		}
	}
	return undefined;
}

export function extractArk(about: string): string | null {
	const match = about.match(/ark:\/[^\s/?#]+\/[^\s/?#]+/i);
	return match ? match[0] : null;
}

export type ParsedFsArk = {
	ark: string;
	/** e.g. `1:1:V5QX-QDB` or `3:1:S3HY-…` */
	name: string;
	kind: "image" | "persona" | "record" | "other";
};

export function parseFsArk(about: string): ParsedFsArk | null {
	const ark = extractArk(about);
	if (!ark) {
		return null;
	}
	const name = ark.replace(/^ark:\/[^/]+\//i, "");
	let kind: ParsedFsArk["kind"] = "other";
	if (name.startsWith("3:1:")) {
		kind = "image";
	} else if (name.startsWith("1:1:")) {
		kind = "persona";
	} else if (name.startsWith("1:2:")) {
		kind = "record";
	}
	return { ark, name, kind };
}

const absoluteUrl = (sdk: FamilySearchSDK, href: string): string => {
	if (/^https?:\/\//i.test(href)) {
		return href;
	}
	const host = sdk.getConfig().platformHost;
	if (href.startsWith("/")) {
		if (href.startsWith("/service/")) {
			return `${sdk.getWebBaseUrl()}${href}`;
		}
		return `${host}${href}`;
	}
	return `${host}/${href}`;
};

/** Known DAS / download URLs for a `3:1:` image ark (authenticated fetch). */
export function candidateDistJpgUrls(
	sdk: FamilySearchSDK,
	imageName: string
): string[] {
	const id = pathId(imageName);
	const web = sdk.getWebBaseUrl();
	const encoded = encodeURIComponent(id);
	return [
		`${web}/service/records/storage/dascloud/das/v2/${id}/dist.jpg`,
		`https://sg30p0.familysearch.org/service/records/storage/dascloud/das/v2/${id}/dist.jpg`,
		`${web}/das/v2/${id}/dist.jpg`,
		`${web}/search/image/download?uri=${encodeURIComponent(
			`https://sg30p0.familysearch.org/service/records/storage/dascloud/das/v2/${id}`
		)}`,
		`${web}/search/image/download?uri=${encodeURIComponent(
			`https://sg30p0.familysearch.org/service/records/storage/dascloud/das/v2/${encoded}`
		)}`,
	];
}

/** When a DAS probe returns `dgs:film.image`, build dist.jpg candidates. */
export function candidateDistJpgUrlsFromDgs(
	sdk: FamilySearchSDK,
	dgsBody: string
): string[] {
	const raw = dgsBody.trim();
	if (!/^dgs:/i.test(raw)) {
		return [];
	}
	const web = sdk.getWebBaseUrl();
	const withPrefix = raw;
	const withoutPrefix = raw.replace(/^dgs:/i, "");
	return [
		`${web}/service/records/storage/dascloud/das/v2/${withPrefix}/dist.jpg`,
		`${web}/service/records/storage/dascloud/das/v2/${withoutPrefix}/dist.jpg`,
		`https://sg30p0.familysearch.org/service/records/storage/dascloud/das/v2/${withPrefix}/dist.jpg`,
		`https://sg30p0.familysearch.org/service/records/storage/dascloud/das/v2/${withoutPrefix}/dist.jpg`,
		`${web}/das/v2/${withPrefix}/dist.jpg`,
		`${web}/das/v2/${withoutPrefix}/dist.jpg`,
	];
}

async function getGedcomx(
	sdk: FamilySearchSDK,
	path: string,
	signal?: AbortSignal
): Promise<GedcomxDocument | null> {
	try {
		const response = await sdk.get<GedcomxDocument>(path, {
			headers: {
				Accept: "application/x-gedcomx-v1+json, application/json",
			},
			signal,
		});
		return response.data || null;
	} catch {
		return null;
	}
}

/** Image-ark (`3:1:…`) refs embedded on a persona / record payload. */
export function collectImageArksFromPersona(
	payload: GedcomxDocument | null | undefined
): ParsedFsArk[] {
	if (!payload?.sourceDescriptions?.length) {
		return [];
	}
	const found: ParsedFsArk[] = [];
	const seen = new Set<string>();
	for (const desc of payload.sourceDescriptions) {
		const about = desc.about;
		if (!about) continue;
		const parsed = parseFsArk(about);
		if (!parsed || parsed.kind !== "image") continue;
		if (seen.has(parsed.name)) continue;
		seen.add(parsed.name);
		found.push(parsed);
	}
	return found;
}

const pickBinaryFromImagePayload = (
	sdk: FamilySearchSDK,
	payload: GedcomxDocument | null
): string | null => {
	if (!payload) {
		return null;
	}
	const fromLinks = pickDownloadableImageHref(undefined, payload.links);
	if (fromLinks) {
		return absoluteUrl(sdk, fromLinks);
	}
	for (const desc of payload.sourceDescriptions || []) {
		const href = pickDownloadableImageHref(desc);
		if (href) {
			return absoluteUrl(sdk, href);
		}
		if (desc.about && isDownloadableRecordImageUrl(desc.about)) {
			return absoluteUrl(sdk, desc.about);
		}
	}
	return null;
};

/**
 * Resolve a `3:1:` image ark to a DAS / dist.jpg URL.
 * Returns the first candidate URL (caller verifies bytes are image/*).
 */
async function resolveImageArkToBinary(
	sdk: FamilySearchSDK,
	imageArk: ParsedFsArk,
	signal?: AbortSignal
): Promise<string | null> {
	const id = pathId(imageArk.name);
	const paths = [
		`/platform/records/images/${id}?flag=fsh`,
		`/platform/records/images/${id}`,
		`/platform/records/images/${id}/metadata?flag=fsh`,
	];
	for (const path of paths) {
		const data = await getGedcomx(sdk, path, signal);
		const binary = pickBinaryFromImagePayload(sdk, data);
		if (binary) {
			return binary;
		}
	}
	// Platform JSON often has no dist.jpg link — use known DAS patterns.
	const candidates = candidateDistJpgUrls(sdk, imageArk.name);
	return candidates[0] ?? null;
}

/**
 * Resolve a source `about` ark (or existing artifact URL) to a downloadable
 * image URL. Returns null when restricted, missing, or not an image source.
 *
 * The returned URL still needs an authenticated fetch; callers must reject
 * non-image bodies (e.g. `text/plain` `dgs:…`).
 */
export async function resolveSourceRecordImageUrl(
	sdk: FamilySearchSDK,
	about: string,
	options?: { signal?: AbortSignal }
): Promise<string | null> {
	if (!about) {
		return null;
	}
	if (isDownloadableRecordImageUrl(about)) {
		return absoluteUrl(sdk, about);
	}

	const parsed = parseFsArk(about);
	if (!parsed) {
		return null;
	}

	const signal = options?.signal;

	if (parsed.kind === "image") {
		return resolveImageArkToBinary(sdk, parsed, signal);
	}

	// Indexed persona (`1:1:`) → DigitalArtifact `3:1:` → binary.
	if (parsed.kind === "persona") {
		const persona = await getGedcomx(
			sdk,
			`/platform/records/personas/${pathId(parsed.name)}?flag=fsh`,
			signal
		);
		const direct = pickBinaryFromImagePayload(sdk, persona);
		if (direct) {
			return direct;
		}
		const imageArks = collectImageArksFromPersona(persona);
		for (const imageArk of imageArks) {
			const binary = await resolveImageArkToBinary(sdk, imageArk, signal);
			if (binary) {
				return binary;
			}
		}
		return null;
	}

	if (parsed.kind === "record") {
		const record = await getGedcomx(
			sdk,
			`/platform/records/records/${pathId(parsed.name)}?flag=fsh`,
			signal
		);
		const direct = pickBinaryFromImagePayload(sdk, record);
		if (direct) {
			return direct;
		}
		for (const imageArk of collectImageArksFromPersona(record)) {
			const binary = await resolveImageArkToBinary(sdk, imageArk, signal);
			if (binary) {
				return binary;
			}
		}
	}

	return null;
}

/**
 * All candidate binary URLs for a source `about` (for callers that try
 * several until image/* bytes succeed).
 */
export async function resolveSourceRecordImageUrlCandidates(
	sdk: FamilySearchSDK,
	about: string,
	options?: { signal?: AbortSignal }
): Promise<string[]> {
	const parsed = parseFsArk(about);
	const primary = await resolveSourceRecordImageUrl(sdk, about, options);
	const out: string[] = [];
	const push = (url: string | null | undefined) => {
		if (url && !out.includes(url)) {
			out.push(url);
		}
	};
	push(primary);

	if (parsed?.kind === "image") {
		for (const url of candidateDistJpgUrls(sdk, parsed.name)) {
			push(url);
		}
	} else if (parsed?.kind === "persona") {
		const persona = await getGedcomx(
			sdk,
			`/platform/records/personas/${pathId(parsed.name)}?flag=fsh`,
			options?.signal
		);
		for (const imageArk of collectImageArksFromPersona(persona)) {
			for (const url of candidateDistJpgUrls(sdk, imageArk.name)) {
				push(url);
			}
		}
	}

	return out;
}
