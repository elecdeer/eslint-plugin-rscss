import { RuleTester } from "@typescript-eslint/rule-tester";
import cssPlugin from "@eslint/css";

export const ruleTester = new RuleTester({
  plugins: {
    css: cssPlugin,
  },
  language: "css/css",
});

// Export ESLintUtils for rule creation helpers
export { ESLintUtils } from "@typescript-eslint/utils";
