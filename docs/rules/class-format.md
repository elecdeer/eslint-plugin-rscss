# rscss/class-format

Enforces RSCSS class naming conventions.

## Rule Details

This rule enforces RSCSS (Reasonable System for CSS Stylesheet Structure) class naming conventions:

- **Components**: 2+ words with hyphens (e.g., `component-name`, `search-form`)
- **Elements**: single word (e.g., `element`, `input`, `title`)
- **Variants**: start with hyphen (e.g., `-primary`, `-highlighted`)
- **Helpers**: start with underscore (e.g., `_helper`, `_clearfix`)

## Options

```js
{
  "rscss/class-format": ["error", {
    "component": "twoWords",         // Format for component names
    "element": "oneWord",            // Format for element names
    "helper": "underScored",         // Format for helper names
    "variant": "dashFirst",          // Format for variant names
    "maxDepth": 4,                   // Maximum selector nesting depth
    "componentWhitelist": []         // Array of allowed single-word component names
  }]
}
```

### Format Options

Each format option (`component`, `element`, `helper`, `variant`) can be set to:

#### Predefined Formats

- `"twoWords"` (default for components): Two or more words with hyphens (e.g., `search-form`, `article-card`)
- `"oneWord"` (default for elements): Single word (e.g., `input`, `title`)
- `"underScored"` (default for helpers): Starts with underscore (e.g., `_helper`, `_clearfix`)
- `"dashFirst"` (default for variants): Starts with dash (e.g., `-primary`, `-highlighted`)
- `"pascal"`: PascalCase naming (e.g., `SearchForm`, `ArticleCard`)

#### Custom Formats

For custom patterns, use an object with `type: "custom"` and a `pattern` property:

```js
{
  "component": {
    "type": "custom",
    "pattern": "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$"
  },
  "element": {
    "type": "custom", 
    "pattern": "^[a-z]+[A-Z][a-zA-Z0-9]*$"
  }
}
```

### `maxDepth` (default: `4`)

Maximum allowed nesting depth for selectors. Counts the number of child combinators (`>`) plus one.

### `componentWhitelist` (default: `[]`)

Array of component names that are allowed even if they don't match the standard RSCSS pattern.

## Examples

### ✅ Valid

```css
/* Components - multi-word with hyphens */
.search-form {
}
.article-card {
}
.user-profile {
}
.navigation-menu {
}

/* Elements - single word, child of component */
.search-form > .input {
}
.article-card > .title {
}
.navigation-menu > .item {
}

/* Variants - start with dash */
.button.-primary {
}
.card.-highlighted {
}
.search-form.-compact {
}

/* Helpers - start with underscore */
._clearfix {
}
._hidden {
}
._text-center {
}

/* Nested elements */
.search-form > .input-group > .input {
}
.article-card > .meta > .author {
}

/* Combined variants */
.search-form > .input.-error {
}
.button.-primary.-large {
}

/* Non-class selectors */
p {
}
div[data-active] {
}
.component:hover {
}
```

### ✅ Valid with options

```css
/* component: "pascal" */
.SearchForm {
}
.ArticleCard {
}
.UserProfile {
}

/* element: "pascal" */
.search-form > .InputField {
}
.article-card > .SubmitButton {
}

/* element: "twoWords" */
.search-form > .input-field {
}
.article-card > .submit-button {
}

/* helper: "twoWords" */
.clear-both {
}
.text-center {
}

/* variant: "oneWord" */
.button.primary {
}
.card.highlighted {
}

/* componentWhitelist: ["component", "button"] */
.component {
}
.button {
}

/* component: { type: "custom", pattern: "^c-[a-z][a-z0-9]*(-[a-z0-9]+)*$" } */
.c-search-form {
}
.c-article-card {
}

/* element: { type: "custom", pattern: "^[a-z]+[A-Z][a-zA-Z0-9]*$" } */
.search-form > .inputField123 {
}
.article-card > .customElement {
}

/* maxDepth: 2 */
.component > .element {
} /* depth: 2 */
```

### ❌ Invalid

```css
/* Invalid component names - single word */
.component {
}
.button {
}
.form {
}

/* Invalid component names - uppercase */
.Component-Name {
}
.Search-Form {
}
.ARTICLE-CARD {
}

/* Invalid component names - underscore */
.component_name {
}
.search_form {
}

/* Invalid element names - multiple words */
.search-form > .input-field {
}
.article-card > .submit-button {
}
.navigation-menu > .menu-item {
}

/* Invalid element names - uppercase */
.search-form > .Input {
}
.article-card > .Title {
}

/* Invalid variant names - no leading dash */
.button.primary {
}
.card.highlighted {
}
.form.compact {
}

/* Invalid variant names - uppercase */
.button.-Primary {
}
.card.-HIGHLIGHTED {
}

/* Invalid helper names - no leading underscore */
.clearfix {
}
.hidden {
}
.text-center {
}

/* Invalid helper names - uppercase */
._Clearfix {
}
._HIDDEN {
}

/* Invalid descendant combinators */
.search-form .input {
}
.article-card .title {
}

/* Too deep nesting (maxDepth: 3) */
.component > .element > .subelement > .subsubelement {
}

/* Multiple component names */
.search-form.article-card {
}
.component-one.component-two {
}
```

## When Not To Use

This rule should not be used if:

- You're not following RSCSS methodology
- You have existing CSS that doesn't follow RSCSS conventions and can't be refactored
- You prefer different naming conventions (BEM, SMACSS, etc.)
