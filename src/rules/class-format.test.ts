import { describe, it } from "vitest";
import { ruleTester } from "../test-utils";
import { classFormat } from "./class-format";

describe("class-format rule", () => {
  describe("should enforce RSCSS class naming conventions", () => {
    ruleTester.run("class-format", classFormat, {
      valid: [
        // Valid component names (2+ words)
        { code: ".good-component { color: red; }" },
        { code: ".search-form { display: block; }" },
        { code: ".article-card { margin: 10px; }" },
        { code: ".user-profile-section { padding: 20px; }" },

        // Valid element names (1 word)
        { code: ".component > .element { color: blue; }" },
        { code: ".search-form > .input { border: 1px solid; }" },
        { code: ".article-card > .title { font-size: 18px; }" },

        // Valid variant names (start with -)
        { code: ".component.-variant { background: gray; }" },
        { code: ".button.-primary { background: blue; }" },
        { code: ".card.-highlighted { border: 2px solid; }" },

        // Valid helper names (start with _)
        { code: "._helper { text-align: center; }" },
        { code: "._clearfix { clear: both; }" },
        { code: "._hidden { display: none; }" },

        // Valid nested combinations
        { code: ".component > .element.-variant { color: green; }" },
        { code: ".search-form > .input.-error { border-color: red; }" },

        // Valid with pseudo-classes
        { code: ".component:hover { opacity: 0.8; }" },
        { code: ".element:focus { outline: 2px solid; }" },

        // Valid with attribute selectors
        { code: ".component[data-active] { display: block; }" },
        { code: '.element[type="text"] { padding: 5px; }' },
      ],
      invalid: [
        // Invalid component names (single word)
        {
          code: ".component { color: red; }",
          errors: [
            {
              messageId: "invalidComponentName",
              data: { selector: ".component" },
            },
          ],
        },
        {
          code: ".button { background: blue; }",
          errors: [
            {
              messageId: "invalidComponentName",
              data: { selector: ".button" },
            },
          ],
        },

        // Invalid component names (uppercase)
        {
          code: ".Component-Name { color: red; }",
          errors: [
            {
              messageId: "invalidComponentName",
              data: { selector: ".Component-Name" },
            },
          ],
        },
        {
          code: ".Search-Form { display: block; }",
          errors: [
            {
              messageId: "invalidComponentName",
              data: { selector: ".Search-Form" },
            },
          ],
        },

        // Invalid component names (underscore)
        {
          code: ".component_name { color: red; }",
          errors: [
            {
              messageId: "invalidComponentName",
              data: { selector: ".component_name" },
            },
          ],
        },

        // Invalid element names (multiple words)
        {
          code: ".component > .bad-element { color: blue; }",
          errors: [
            {
              messageId: "invalidElementName",
              data: { selector: ".bad-element" },
            },
          ],
        },
        {
          code: ".component > .input-field { border: 1px solid; }",
          errors: [
            {
              messageId: "invalidElementName",
              data: { selector: ".input-field" },
            },
          ],
        },

        // Invalid variant names (not starting with -)
        {
          code: ".component.variant { background: gray; }",
          errors: [
            {
              messageId: "invalidVariantName",
              data: { selector: ".variant" },
            },
          ],
        },
        {
          code: ".component.primary { background: blue; }",
          errors: [
            {
              messageId: "invalidVariantName",
              data: { selector: ".primary" },
            },
          ],
        },

        // Invalid helper names (not starting with _)
        {
          code: ".helper { text-align: center; }",
          errors: [
            {
              messageId: "invalidHelperName",
              data: { selector: ".helper" },
            },
          ],
        },

        // Invalid mixed cases
        {
          code: ".component > .element.variant { color: green; }",
          errors: [
            {
              messageId: "invalidVariantName",
              data: { selector: ".variant" },
            },
          ],
        },

        // Invalid descendant combinator usage
        {
          code: ".component .element { color: blue; }",
          errors: [
            {
              messageId: "unexpectedDescendantCombinator",
              data: { selector: ".component .element" },
            },
          ],
        },
      ],
    });
  });

  describe("should handle complex selectors", () => {
    ruleTester.run("class-format", classFormat, {
      valid: [
        // Complex valid selectors
        { code: ".search-form > .input-group > .input { border: 1px solid; }" },
        {
          code: ".article-card > .meta > .author.-featured { font-weight: bold; }",
        },
        { code: ".navigation-menu > .item:hover { background: #f0f0f0; }" },
      ],
      invalid: [
        // Complex invalid selectors
        {
          code: ".search-form .input-group .input { border: 1px solid; }",
          errors: [
            {
              messageId: "unexpectedDescendantCombinator",
              data: { selector: ".search-form .input-group .input" },
            },
          ],
        },
        {
          code: ".article > .bad-element-name { color: blue; }",
          errors: [
            {
              messageId: "invalidElementName",
              data: { selector: ".bad-element-name" },
            },
          ],
        },
      ],
    });
  });

  describe("should handle configuration options", () => {
    // Test with custom configuration
    ruleTester.run("class-format", classFormat, {
      valid: [
        {
          code: ".CustomComponent { color: red; }",
          options: [{ allowPascalCase: true }],
        },
        {
          code: ".search-form > .inputField { border: 1px solid; }",
          options: [{ allowCamelCase: true }],
        },
      ],
      invalid: [
        {
          code: ".CustomComponent { color: red; }",
          errors: [
            {
              messageId: "invalidComponentName",
              data: { selector: ".CustomComponent" },
            },
          ],
        },
        {
          code: ".search-form > .inputField { border: 1px solid; }",
          errors: [
            {
              messageId: "invalidElementName",
              data: { selector: ".inputField" },
            },
          ],
        },
      ],
    });
  });
});
