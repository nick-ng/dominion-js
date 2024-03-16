import { buildSync } from "esbuild";

const options = {
	bundle: true,
	format: "esm",
	platform: "node",
	external: ["./node_modules/*"],
	target: ["node20"],
};

export const mainOptions = {
	...options,
	entryPoints: ["./src-server/main.ts"],
	outfile: "./dist-server/main.js",
};

buildSync(mainOptions);

export const workerOptions = {
	...options,
	entryPoints: ["./src-server/worker.ts"],
	outfile: "./dist-server/worker.js",
};

buildSync(workerOptions);
