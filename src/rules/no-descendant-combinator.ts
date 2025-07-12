import { ESLintUtils } from "@typescript-eslint/utils";

type MessageIds = "unexpectedDescendantCombinator";

const createRule = ESLintUtils.RuleCreator(
	(name) =>
		`https://github.com/your-org/eslint-plugin-rscss/blob/main/docs/rules/${name}.md`,
);

export const noDescendantCombinator = createRule<[], MessageIds>({
	name: "no-descendant-combinator",
	defaultOptions: [],
	meta: {
		type: "problem",
		docs: {
			description: "Disallow descendant combinators in CSS selectors",
		},
		schema: [],
		messages: {
			unexpectedDescendantCombinator:
				'Unexpected descendant combinator in "{{selector}}". Use direct child combinator (>) instead.',
		},
	},
	create(context) {
		function hasDescendantCombinator(selectorText: string): boolean {
			// Remove comments and normalize whitespace
			const normalized = selectorText
				.replace(/\/\*.*?\*\//g, "")
				.replace(/\s+/g, " ")
				.trim();

			// Split by commas to handle multiple selectors
			const selectors = normalized.split(",").map((s) => s.trim());

			for (const selector of selectors) {
				// Check if selector contains descendant combinator
				// A descendant combinator is a space between two class selectors
				// that is not part of a child combinator (>)

				// Split by spaces and check for consecutive class selectors
				const parts = selector.split(/\s+/);

				for (let i = 0; i < parts.length - 1; i++) {
					const current = parts[i];
					const next = parts[i + 1];

					// Check if current part contains a class selector
					const currentHasClass = current.includes(".");
					// Check if next part starts with a class selector
					const nextStartsWithClass = next.startsWith(".");

					// If both conditions are true and current doesn't end with >
					// and next doesn't start with >, it's a descendant combinator
					if (
						currentHasClass &&
						nextStartsWithClass &&
						!current.endsWith(">") &&
						!next.startsWith(">")
					) {
						return true;
					}
				}
			}

			return false;
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

					if (hasDescendantCombinator(selectorText)) {
						context.report({
							node: selector,
							messageId: "unexpectedDescendantCombinator",
							data: { selector: selectorText.trim() },
						});
					}
				});
			},
		};
	},
});
