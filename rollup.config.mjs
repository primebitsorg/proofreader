import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
	input: "src/cli.ts",
	output: {
		file: "dist/bin/pedantify.js",
		format: "esm",
		banner: "#!/usr/bin/env node"
	},
	plugins: [
		resolve({ preferBuiltins: true }),
		commonjs(),
		typescript({ tsconfig: "./tsconfig.json", declaration: false }),
		json(),
	],
	external: [] // add things like 'fs', 'path', or other Node built-ins if needed
};
