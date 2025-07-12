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
        options: [{ allowPascalCase: true }],
      },
      {
        code: ".GoodComponent.-variant { }",
        options: [{ allowPascalCase: true }],
      },
      {
        code: ".GoodComponent > .element { }",
        options: [{ allowPascalCase: true }],
      },
    ],
    invalid: [
      {
        code: ".bad-Component { }",
        options: [{ allowPascalCase: true }],
        errors: [
          {
            messageId: "invalidComponentName",
            data: { selector: ".bad-Component" },
          },
        ],
      },
      {
        code: ".badComponent { }",
        options: [{ allowPascalCase: true }],
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
        options: [{ componentFormat: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$" }],
      },
      {
        code: ".c-good-component.-variant { }",
        options: [{ componentFormat: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$" }],
      },
    ],
    invalid: [
      {
        code: ".bad-component { }",
        options: [{ componentFormat: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$" }],
        errors: [
          {
            messageId: "invalidComponentName",
            data: { selector: ".bad-component" },
          },
        ],
      },
      {
        code: ".c-BadComponent { }",
        options: [{ componentFormat: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$" }],
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
              selector: ".my-component > .element > .subelement > .subsubelement",
              maxDepth: "3"
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
