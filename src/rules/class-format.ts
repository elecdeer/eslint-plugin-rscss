import { ESLintUtils } from "@typescript-eslint/utils";

type MessageIds =
	| "invalidComponentName"
	| "invalidElementName"
	| "invalidVariantName"
	| "invalidHelperName"
	| "unexpectedDescendantCombinator"
	| "onlyOneComponentName"
	| "maxDepthExceeded";

type FormatOption =
	| "twoWords"
	| "oneWord"
	| "underScored"
	| "dashFirst"
	| "pascal"
	| { type: "custom"; pattern: string };

export interface Options {
	component?: FormatOption;
	element?: FormatOption;
	helper?: FormatOption;
	variant?: FormatOption;
	maxDepth?: number;
	componentWhitelist?: string[];
}

const createRule = ESLintUtils.RuleCreator(
	(name) =>
		`https://github.com/elecdeer/eslint-plugin-rscss/blob/main/docs/rules/${name}.md`,
);

export const classFormat = createRule<[Options?], MessageIds>({
	name: "class-format",
	defaultOptions: [{}],
	meta: {
		type: "problem",
		docs: {
			description: "Enforce RSCSS class naming conventions",
		},
		schema: [
			{
				type: "object",
				properties: {
					component: {
						oneOf: [
							{
								type: "string",
								enum: [
									"twoWords",
									"oneWord",
									"underScored",
									"dashFirst",
									"pascal",
								],
							},
							{
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["custom"],
									},
									pattern: {
										type: "string",
									},
								},
								required: ["type", "pattern"],
								additionalProperties: false,
							},
						],
						default: "twoWords",
					},
					element: {
						oneOf: [
							{
								type: "string",
								enum: [
									"twoWords",
									"oneWord",
									"underScored",
									"dashFirst",
									"pascal",
								],
							},
							{
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["custom"],
									},
									pattern: {
										type: "string",
									},
								},
								required: ["type", "pattern"],
								additionalProperties: false,
							},
						],
						default: "oneWord",
					},
					helper: {
						oneOf: [
							{
								type: "string",
								enum: [
									"twoWords",
									"oneWord",
									"underScored",
									"dashFirst",
									"pascal",
								],
							},
							{
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["custom"],
									},
									pattern: {
										type: "string",
									},
								},
								required: ["type", "pattern"],
								additionalProperties: false,
							},
						],
						default: "underScored",
					},
					variant: {
						oneOf: [
							{
								type: "string",
								enum: [
									"twoWords",
									"oneWord",
									"underScored",
									"dashFirst",
									"pascal",
								],
							},
							{
								type: "object",
								properties: {
									type: {
										type: "string",
										enum: ["custom"],
									},
									pattern: {
										type: "string",
									},
								},
								required: ["type", "pattern"],
								additionalProperties: false,
							},
						],
						default: "dashFirst",
					},
					maxDepth: {
						type: "integer",
						minimum: 1,
						default: 4,
					},
					componentWhitelist: {
						type: "array",
						items: {
							type: "string",
						},
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
			onlyOneComponentName:
				'Only one component name is allowed: "{{selector}}".',
			maxDepthExceeded:
				'Maximum depth of {{maxDepth}} exceeded in selector "{{selector}}".',
		},
	},
	create(context) {
		const options: Options = context.options[0] || {};

		// Default patterns for each type
		const defaultPatterns = {
			twoWords: /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/, // 2+ words with hyphens
			oneWord: /^[a-z][a-z0-9]*$/, // single word
			dashFirst: /^-[a-z][a-z0-9]*(-[a-z0-9]+)*$/, // starts with -
			underScored: /^_[a-z][a-z0-9]*(-[a-z0-9]+)*$/, // starts with _
			pascal: /^[A-Z][a-zA-Z0-9]*$/, // Pascal case
		};

		// Generate pattern for given format option
		function getPatternForFormat(format: FormatOption): RegExp {
			if (typeof format === "string") {
				if (format in defaultPatterns) {
					return defaultPatterns[format as keyof typeof defaultPatterns];
				}
				// Fallback: treat as custom regex for backward compatibility
				return new RegExp(format);
			}
			// Custom pattern object
			return new RegExp(format.pattern);
		}

		// Get patterns for each selector type
		const componentPattern = getPatternForFormat(
			options.component || "twoWords",
		);
		const elementPattern = getPatternForFormat(options.element || "oneWord");
		const variantPattern = getPatternForFormat(options.variant || "dashFirst");
		const helperPattern = getPatternForFormat(options.helper || "underScored");

		// Component whitelist
		const componentWhitelist = options.componentWhitelist || [];

		// Max depth (default: 4)
		const maxDepth = options.maxDepth || 4;

		function isValidComponentName(name: string): boolean {
			// Check whitelist first
			if (componentWhitelist.includes(name)) {
				return true;
			}
			return componentPattern.test(name);
		}

		function isValidElementName(name: string): boolean {
			return elementPattern.test(name);
		}

		function isValidVariantName(name: string): boolean {
			// If variant format is not "dashFirst", remove the leading "-" for pattern matching
			const variantFormat = options.variant || "dashFirst";
			const isDefaultDashFirst =
				typeof variantFormat === "string" && variantFormat === "dashFirst";
			if (!isDefaultDashFirst && name.startsWith("-")) {
				return variantPattern.test(name.slice(1));
			}
			return variantPattern.test(name);
		}

		function isValidHelperName(name: string): boolean {
			// If helper format is not "underScored", remove the leading "_" for pattern matching
			const helperFormat = options.helper || "underScored";
			const isDefaultUnderScored =
				typeof helperFormat === "string" && helperFormat === "underScored";
			if (!isDefaultUnderScored && name.startsWith("_")) {
				return helperPattern.test(name.slice(1));
			}
			return helperPattern.test(name);
		}

		function analyzeSelector(
			selector: string,
			context: "standalone" | "child",
		): {
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
			const helperLikeNames = [
				"helper",
				"utility",
				"util",
				"clearfix",
				"hidden",
				"visible",
				"left",
				"right",
				"center",
			];
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
				return {
					type: "component",
					name: className,
					isValid: isValidComponentName(className),
				};
			} else {
				// Child context: treat as element
				return {
					type: "element",
					name: className,
					isValid: isValidElementName(className),
				};
			}
		}

		function determineClassContext(
			selectorText: string,
			classSelector: string,
		): "standalone" | "child" {
			// If no child combinator, all classes are at component level
			if (!selectorText.includes(">")) {
				return "standalone";
			}

			// Split by child combinator to analyze position
			const parts = selectorText.split(">").map((part) => part.trim());

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

		function checkSelectorDepth(selectorText: string): boolean {
			// Count child combinators (>) to determine depth
			const childCombinators = (selectorText.match(/>/g) || []).length;
			return childCombinators + 1 <= maxDepth;
		}

		function checkMultipleComponentNames(selectorText: string): boolean {
			// Split by all combinators (>, +, ~, space) to get individual selector parts
			const parts = selectorText
				.split(/[\s>+~]+/)
				.map((part) => part.trim())
				.filter((part) => part);

			for (const part of parts) {
				// Look for multiple classes in a single part (like .class1.class2)
				const classes = part.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];
				let componentCount = 0;

				for (const classSelector of classes) {
					const className = classSelector.replace(/^\./, "");

					// Skip variants and helpers
					if (className.startsWith("-") || className.startsWith("_")) {
						continue;
					}

					// Check if it looks like a component (multi-word or whitelisted)
					if (
						componentWhitelist.includes(className) ||
						componentPattern.test(className)
					) {
						componentCount++;
					}
				}

				// Only check for multiple components in the same element (.comp1.comp2)
				if (componentCount > 1) {
					return false;
				}
			}

			return true;
		}

		return {
			Rule(node: any) {
				const prelude = node.prelude;
				if (!prelude || prelude.type !== "SelectorList") return;

				// Process each selector in the list
				prelude.children.forEach((selector: any) => {
					if (selector.type !== "Selector") return;

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

					// Check maximum depth
					if (!checkSelectorDepth(selectorText)) {
						context.report({
							node: selector,
							messageId: "maxDepthExceeded",
							data: {
								selector: selectorText,
								maxDepth: maxDepth.toString(),
							},
						});
						return;
					}

					// Check for multiple component names
					if (!checkMultipleComponentNames(selectorText)) {
						context.report({
							node: selector,
							messageId: "onlyOneComponentName",
							data: { selector: selectorText },
						});
						return;
					}

					// Extract class selectors from the selector
					const classSelectors =
						selectorText.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];

					for (const classSelector of classSelectors) {
						// Determine context based on position in selector
						const selectorContext = determineClassContext(
							selectorText,
							classSelector,
						);
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
});
