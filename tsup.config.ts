import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"auth/index": "src/auth/index.ts",
		"places/index": "src/places/index.ts",
		"tree/index": "src/tree/index.ts",
		"utils/index": "src/utils/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: false,
	treeshake: true,
	minify: false,
});
