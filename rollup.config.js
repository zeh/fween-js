import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

export default {
	input: "src/Fween.ts",
	output: [
		{ name: "fween", sourcemap: true, file: pkg.module, format: "es" },
		{
			name: "Fween",
			sourcemap: true,
			file: pkg.main,
			format: "umd",
			footer: "module.exports.default = module.exports; // Terrible injection just so it works regardless of how it's required\n"
		}
	],
	plugins: [
		resolve(),
		typescript({
			typescript: require("typescript")
		})
	]
};
