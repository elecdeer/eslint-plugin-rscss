import { RuleTester } from "eslint";
import cssPlugin from "@eslint/css";
import { describe, it } from "vitest";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

export const ruleTester = new RuleTester({
  plugins: {
    css: cssPlugin,
  },
  language: "css/css",
});
