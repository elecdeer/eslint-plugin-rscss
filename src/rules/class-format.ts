import type { Rule } from "eslint";

type MessageIds =
  | "invalidComponentName"
  | "invalidElementName"
  | "invalidVariantName"
  | "invalidHelperName"
  | "unexpectedDescendantCombinator";

export interface Options {
  allowPascalCase?: boolean;
  allowCamelCase?: boolean;
}

export const classFormat: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce RSCSS class naming conventions",
      category: "Stylistic Issues",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          allowPascalCase: {
            type: "boolean",
            default: false,
          },
          allowCamelCase: {
            type: "boolean",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidComponentName:
        'Invalid component name "{{selector}}". Components must be two or more words separated by hyphens (e.g., "component-name").',
      invalidElementName:
        'Invalid element name "{{selector}}". Elements must be one word (e.g., "element").',
      invalidVariantName:
        'Invalid variant name "{{selector}}". Variants must start with a hyphen (e.g., "-variant").',
      invalidHelperName:
        'Invalid helper name "{{selector}}". Helpers must start with an underscore (e.g., "_helper").',
      unexpectedDescendantCombinator:
        'Unexpected descendant combinator in "{{selector}}". Use direct child combinator (>) instead.',
    },
  },
  create(context: Rule.RuleContext) {
    const options: Options = context.options[0] || {};

    // RSCSS naming patterns
    const componentPattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/; // 2+ words with hyphens
    const elementPattern = /^[a-z][a-z0-9]*$/; // single word
    const variantPattern = /^-[a-z][a-z0-9]*(-[a-z0-9]+)*$/; // starts with -
    const helperPattern = /^_[a-z][a-z0-9]*(-[a-z0-9]+)*$/; // starts with _

    // Pascal case patterns (if allowed)
    const pascalComponentPattern = /^[A-Z][a-zA-Z0-9]*$/;
    const camelElementPattern = /^[a-z][a-zA-Z0-9]*$/;

    function isValidComponentName(name: string): boolean {
      if (options.allowPascalCase && pascalComponentPattern.test(name)) {
        return true;
      }
      return componentPattern.test(name);
    }

    function isValidElementName(name: string): boolean {
      if (options.allowCamelCase && camelElementPattern.test(name)) {
        return true;
      }
      return elementPattern.test(name);
    }

    function isValidVariantName(name: string): boolean {
      return variantPattern.test(name);
    }

    function isValidHelperName(name: string): boolean {
      return helperPattern.test(name);
    }

    function analyzeSelector(selector: string, context: "standalone" | "child"): {
      type: "component" | "element" | "variant" | "helper" | "unknown";
      name: string;
      isValid: boolean;
    } {
      const className = selector.replace(/^\./, "");

      // Proper helpers start with _
      if (className.startsWith("_")) {
        return {
          type: "helper",
          name: className,
          isValid: isValidHelperName(className),
        };
      }

      if (className.startsWith("-")) {
        return {
          type: "variant",
          name: className,
          isValid: isValidVariantName(className),
        };
      }

      // Check for common helper-like names without underscore (invalid helpers)
      const helperLikeNames = ["helper", "utility", "util", "clearfix", "hidden", "visible", "left", "right", "center"];
      if (helperLikeNames.includes(className.toLowerCase())) {
        return {
          type: "helper",
          name: className,
          isValid: false, // Should start with underscore
        };
      }

      // Context determines classification
      if (context === "standalone") {
        // Standalone: must be component
        if (className.includes("-") || (options.allowPascalCase && pascalComponentPattern.test(className))) {
          return {
            type: "component",
            name: className,
            isValid: isValidComponentName(className),
          };
        } else {
          // Single word standalone = invalid component
          return {
            type: "component",
            name: className,
            isValid: false,
          };
        }
      } else {
        // Child context: treat as element
        return {
          type: "element",
          name: className,
          isValid: isValidElementName(className), // Elements can't have hyphens
        };
      }
    }

    function determineClassContext(selectorText: string, classSelector: string): "standalone" | "child" {
      // If no child combinator, all classes are at component level
      if (!selectorText.includes(">")) {
        return "standalone";
      }

      // Split by child combinator to analyze position
      const parts = selectorText.split(">").map(part => part.trim());
      
      // Find which part contains this class
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes(classSelector)) {
          // First part (before >) = component level
          // Other parts = child level
          return i === 0 ? "standalone" : "child";
        }
      }

      return "standalone";
    }

    function checkDescendantCombinator(selectorText: string): boolean {
      // Check for descendant combinator (space without >)
      const normalizedSelector = selectorText.replace(/\s+/g, " ").trim();

      // Split by spaces and check if there are consecutive class selectors without >
      const parts = normalizedSelector.split(/\s+/);

      for (let i = 0; i < parts.length - 1; i++) {
        const current = parts[i];
        const next = parts[i + 1];

        // If current part ends with a class selector and next starts with a class selector
        // and there's no > combinator, it's a descendant combinator
        if (
          current.includes(".") &&
          next.startsWith(".") &&
          !current.endsWith(">") &&
          !next.startsWith(">")
        ) {
          return true;
        }
      }

      return false;
    }

    return {
      Rule(node: any) {
        const prelude = node.prelude;
        if (!prelude || prelude.type !== 'SelectorList') return;

        // Process each selector in the list
        prelude.children.forEach((selector: any) => {
          if (selector.type !== 'Selector') return;
          
          // Get the raw selector text for analysis
          const selectorText = context.sourceCode.getText(selector);
          if (!selectorText) return;

          // Check for descendant combinator
          if (checkDescendantCombinator(selectorText)) {
            context.report({
              node: selector,
              messageId: "unexpectedDescendantCombinator",
              data: { selector: selectorText },
            });
            return;
          }

          // Extract class selectors from the selector
          const classSelectors =
            selectorText.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];

          for (const classSelector of classSelectors) {
            // Determine context based on position in selector
            const selectorContext = determineClassContext(selectorText, classSelector);
            const analysis = analyzeSelector(classSelector, selectorContext);

            if (!analysis.isValid) {
              let messageId: MessageIds;

              switch (analysis.type) {
                case "component":
                  messageId = "invalidComponentName";
                  break;
                case "element":
                  messageId = "invalidElementName";
                  break;
                case "variant":
                  messageId = "invalidVariantName";
                  break;
                case "helper":
                  messageId = "invalidHelperName";
                  break;
                default:
                  continue;
              }

              context.report({
                node: selector,
                messageId,
                data: { selector: classSelector },
              });
            }
          }
        });
      },
    };
  },
};
