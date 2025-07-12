import { classFormat } from "./rules/class-format";
import { noDescendantCombinator } from "./rules/no-descendant-combinator";
import { TSESLint } from "@typescript-eslint/utils";

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: "eslint-plugin-rscss",
    version: "1.0.0",
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
