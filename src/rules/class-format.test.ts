import { describe } from "vitest";
import { ruleTester } from "../test-utils";
import { classFormat } from "./class-format";

describe("basic class format", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{ code: ".good-component { }" },
			{ code: ".good-component.-xyz { }" },
			{ code: ".good-component.-no-xyz { }" },
			{ code: "p { }" },
			{ code: `[aria-hidden="true"] { }` },
			{ code: "._helper { }" },
			{ code: "._helper._helper { }" },
			{ code: ".my-component > .element { }" },
			{ code: ".my-component > .element > .element2 { }" },
			{ code: ".my-component > .ok { }" },
			{ code: ".my-component + .my-component { }" },
			{ code: ".my-component > a.-home { }" },
		],
		invalid: [
			{
				code: ".badcomponent { }",
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".badcomponent" },
					},
				],
			},
			{
				code: ".badcomponent.-xyz { }",
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".badcomponent" },
					},
				],
			},
			{
				code: ".badcomponent.-abc > .xyz { }",
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".badcomponent" },
					},
				],
			},
			{
				code: ".too-many.component-names { }",
				errors: [
					{
						messageId: "onlyOneComponentName",
						data: { selector: ".too-many.component-names" },
					},
				],
			},
		],
	});
});

describe("pascal case naming", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: ".GoodComponent { }",
				options: [{ component: "pascal" }],
			},
			{
				code: ".GoodComponent.-variant { }",
				options: [{ component: "pascal" }],
			},
			{
				code: ".GoodComponent > .element { }",
				options: [{ component: "pascal" }],
			},
		],
		invalid: [
			{
				code: ".bad-Component { }",
				options: [{ component: "pascal" }],
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".bad-Component" },
					},
				],
			},
			{
				code: ".badComponent { }",
				options: [{ component: "pascal" }],
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".badComponent" },
					},
				],
			},
		],
	});
});

describe("custom format", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: ".c-good-component { }",
				options: [
					{
						component: {
							type: "custom",
							pattern: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$",
						},
					},
				],
			},
			{
				code: ".c-good-component.-variant { }",
				options: [
					{
						component: {
							type: "custom",
							pattern: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$",
						},
					},
				],
			},
		],
		invalid: [
			{
				code: ".bad-component { }",
				options: [
					{
						component: {
							type: "custom",
							pattern: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$",
						},
					},
				],
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".bad-component" },
					},
				],
			},
			{
				code: ".c-BadComponent { }",
				options: [
					{
						component: {
							type: "custom",
							pattern: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$",
						},
					},
				],
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".c-BadComponent" },
					},
				],
			},
		],
	});
});

describe("depth", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{ code: ".my-component > .element { }" },
			{ code: ".my-component > .element > .subelement { }" },
			{
				code: ".my-component > .element > .subelement { }",
				options: [{ maxDepth: 3 }],
			},
		],
		invalid: [
			{
				code: ".my-component > .element > .subelement > .subsubelement { }",
				options: [{ maxDepth: 3 }],
				errors: [
					{
						messageId: "maxDepthExceeded",
						data: {
							selector:
								".my-component > .element > .subelement > .subsubelement",
							maxDepth: "3",
						},
					},
				],
			},
		],
	});
});

describe("whitelist", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: ".component { }",
				options: [{ componentWhitelist: ["component"] }],
			},
			{
				code: ".component.-variant { }",
				options: [{ componentWhitelist: ["component"] }],
			},
			{
				code: ".component > .element { }",
				options: [{ componentWhitelist: ["component"] }],
			},
		],
		invalid: [
			{
				code: ".other { }",
				options: [{ componentWhitelist: ["component"] }],
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".other" },
					},
				],
			},
		],
	});
});

describe("element format options", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: ".my-component > .title { }",
				options: [{ element: "oneWord" }],
			},
			{
				code: ".my-component > .Title { }",
				options: [{ element: "pascal" }],
			},
			{
				code: ".my-component > .complex-title { }",
				options: [{ element: "twoWords" }],
			},
		],
		invalid: [
			{
				code: ".my-component > .Title { }",
				options: [{ element: "oneWord" }],
				errors: [
					{
						messageId: "invalidElementName",
						data: { selector: ".Title" },
					},
				],
			},
			{
				code: ".my-component > .complex-title { }",
				options: [{ element: "oneWord" }],
				errors: [
					{
						messageId: "invalidElementName",
						data: { selector: ".complex-title" },
					},
				],
			},
		],
	});
});

describe("helper format options", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: "._helper { }",
				options: [{ helper: "underScored" }],
			},
			{
				code: ".clear-both { }",
				options: [{ helper: "twoWords" }],
			},
		],
		invalid: [
			{
				code: ".helper { }",
				options: [{ helper: "underScored" }],
				errors: [
					{
						messageId: "invalidHelperName",
						data: { selector: ".helper" },
					},
				],
			},
		],
	});
});

describe("variant format options", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: ".my-component.-primary { }",
				options: [{ variant: "dashFirst" }],
			},
			{
				code: ".my-component.-good-name { }",
				options: [{ variant: "twoWords" }],
			},
		],
		invalid: [
			{
				code: ".my-component.-bad { }",
				options: [{ variant: "twoWords" }],
				errors: [
					{
						messageId: "invalidVariantName",
						data: { selector: ".-bad" },
					},
				],
			},
		],
	});
});

describe("custom format objects", () => {
	ruleTester.run("class-format", classFormat, {
		valid: [
			{
				code: ".BEM__element { }",
				options: [{ component: { type: "custom", pattern: "^BEM__[a-z]+$" } }],
			},
			{
				code: ".my-component > .customElement123 { }",
				options: [
					{ element: { type: "custom", pattern: "^[a-z]+[A-Z][a-zA-Z0-9]*$" } },
				],
			},
		],
		invalid: [
			{
				code: ".bad__element { }",
				options: [{ component: { type: "custom", pattern: "^BEM__[a-z]+$" } }],
				errors: [
					{
						messageId: "invalidComponentName",
						data: { selector: ".bad__element" },
					},
				],
			},
		],
	});
});
