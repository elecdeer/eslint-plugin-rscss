import { ruleTester } from "../test-utils";
import { noDescendantCombinator } from "./no-descendant-combinator";

ruleTester.run("no-descendant-combinator", noDescendantCombinator, {
	valid: [
		// Valid: direct child combinator
		{ code: ".parent > .child { color: red; }" },
		{ code: ".component > .element { display: block; }" },
		{ code: ".search-form > .input { border: 1px solid; }" },
		{ code: ".article-card > .title { font-size: 18px; }" },

		// Valid: single selectors
		{ code: ".component { color: blue; }" },
		{ code: ".element { padding: 10px; }" },
		{ code: "._helper { text-align: center; }" },

		// Valid: multiple child combinators
		{ code: ".parent > .child > .grandchild { color: green; }" },
		{ code: ".component > .element > .nested { margin: 5px; }" },

		// Valid: adjacent sibling combinator
		{ code: ".element + .element { margin-top: 10px; }" },
		{ code: ".button + .button { margin-left: 5px; }" },

		// Valid: general sibling combinator
		{ code: ".header ~ .content { padding-top: 20px; }" },
		{ code: ".title ~ .description { color: gray; }" },

		// Valid: pseudo-classes
		{ code: ".component:hover { opacity: 0.8; }" },
		{ code: ".element:focus { outline: 2px solid; }" },
		{ code: ".button:active { transform: scale(0.95); }" },

		// Valid: pseudo-elements
		{ code: '.element::before { content: ""; }' },
		{ code: ".component::after { clear: both; }" },

		// Valid: attribute selectors
		{ code: ".component[data-active] { display: block; }" },
		{ code: '.element[type="text"] { padding: 5px; }' },

		// Valid: complex selectors with child combinators
		{ code: ".nav > .item > .link:hover { color: blue; }" },
		{ code: ".form > .field > .input[required] { border-color: red; }" },

		// Valid: multiple selectors
		{ code: ".component > .element, .other > .child { color: black; }" },
		{ code: ".button, .link { text-decoration: none; }" },
	],
	invalid: [
		// Invalid: descendant combinator (space)
		{
			code: ".parent .child { color: red; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".parent .child" },
				},
			],
		},
		{
			code: ".component .element { display: block; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element" },
				},
			],
		},

		// Invalid: multiple descendant combinators
		{
			code: ".parent .child .grandchild { color: green; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".parent .child .grandchild" },
				},
			],
		},
		{
			code: ".component .element .nested { margin: 5px; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element .nested" },
				},
			],
		},

		// Invalid: mixed combinators with descendant
		{
			code: ".parent > .child .grandchild { color: blue; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".parent > .child .grandchild" },
				},
			],
		},
		{
			code: ".component .element > .nested { padding: 10px; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element > .nested" },
				},
			],
		},

		// Invalid: descendant with pseudo-classes
		{
			code: ".component .element:hover { opacity: 0.8; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element:hover" },
				},
			],
		},

		// Invalid: descendant with pseudo-elements
		{
			code: '.component .element::before { content: ""; }',
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element::before" },
				},
			],
		},

		// Invalid: descendant with attribute selectors
		{
			code: ".component .element[data-active] { display: block; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element[data-active]" },
				},
			],
		},

		// Invalid: complex selectors with descendant combinators
		{
			code: ".nav .item .link { color: blue; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".nav .item .link" },
				},
			],
		},

		// Invalid: multiple selectors with descendant combinators
		{
			code: ".component .element, .other .child { color: black; }",
			errors: [
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".component .element" },
				},
				{
					messageId: "unexpectedDescendantCombinator",
					data: { selector: ".other .child" },
				},
			],
		},
	],
});
