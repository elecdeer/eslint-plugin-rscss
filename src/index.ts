import type { TSESLint } from "@typescript-eslint/utils";
import packageJson from "../package.json";
import { classFormat } from "./rules/class-format";
import { noDescendantCombinator } from "./rules/no-descendant-combinator";

const plugin: TSESLint.FlatConfig.Plugin = {
	meta: {
		name: "eslint-plugin-rscss",
		version: packageJson.version,
	},
	rules: {
		"class-format": classFormat,
		"no-descendant-combinator": noDescendantCombinator,
	},
};

const sharedConfig = {
	recommended: {
		plugins: {
			rscss: plugin,
		},
		rules: {
			"rscss/class-format": "error",
			"rscss/no-descendant-combinator": "error",
		},
	} satisfies TSESLint.FlatConfig.Config,
} as const;

plugin.configs = sharedConfig;

export default plugin;
