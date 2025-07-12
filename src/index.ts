import { classFormat } from "./rules/class-format";
import { noDescendantCombinator } from "./rules/no-descendant-combinator";

const plugin = {
	meta: {
		name: "eslint-plugin-rscss",
		version: "1.0.0",
	},
	rules: {
		"class-format": classFormat,
		"no-descendant-combinator": noDescendantCombinator,
	},
	configs: {
		recommended: {
			plugins: ["rscss"],
			rules: {
				"rscss/class-format": "error",
				"rscss/no-descendant-combinator": "error",
			},
		},
	},
};

export default plugin;
