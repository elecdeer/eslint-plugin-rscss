# rscss/no-descendant-combinator

Prevents descendant combinators (space) in CSS selectors, enforcing direct child combinator (`>`) usage.

## Rule Details

This rule enforces the use of direct child combinator (`>`) instead of descendant combinators (space) in CSS selectors. This is a core principle of RSCSS methodology to maintain clear component boundaries and prevent unintended style inheritance.

In RSCSS, components should only style their direct children (elements), not deeply nested descendants. This helps maintain encapsulation and prevents styles from affecting unintended elements.

## Examples

### ✅ Valid

```css
/* Direct child combinators */
.component > .element {
}
.search-form > .input {
}
.article-card > .title {
}

/* Multiple levels with child combinators */
.component > .element > .subelement {
}
.search-form > .input-group > .input {
}
.navigation-menu > .item > .link {
}

/* Sibling combinators are allowed */
.component + .component {
}
.element ~ .element {
}

/* Adjacent sibling combinator */
.tab.-active + .tab {
}

/* General sibling combinator */
.item:first-child ~ .item {
}

/* Non-class selectors */
.component > p {
}
.component > div {
}
.component > [data-role="button"] {
}

/* Pseudo-selectors */
.component > .element:hover {
}
.component > .element:nth-child(2) {
}
.component > .element::before {
}

/* Attribute selectors with child combinator */
.component > .element[type="text"] {
}
.component[data-state="active"] > .element {
}

/* Complex selectors with child combinators */
.component:not(.disabled) > .element {
}
.component.variant > .element.-modifier {
}
```

### ❌ Invalid

```css
/* Descendant combinators (space) */
.component .element {
}
.search-form .input {
}
.article-card .title {
}

/* Multiple levels with descendant combinators */
.component .element .subelement {
}
.search-form .input-group .input {
}
.navigation-menu .item .link {
}

/* Mixed combinators */
.component > .element .subelement {
}
.search-form .input-group > .input {
}

/* Descendant combinators with pseudo-selectors */
.component .element:hover {
}
.component .element:nth-child(2) {
}

/* Descendant combinators with attribute selectors */
.component .element[type="text"] {
}
.component[data-state="active"] .element {
}

/* Complex selectors with descendant combinators */
.component:not(.disabled) .element {
}
.component.variant .element.-modifier {
}
```

## Why This Rule Exists

### 1. Component Encapsulation

RSCSS promotes component-based architecture where each component is self-contained. Using descendant combinators can break this encapsulation by allowing styles to affect nested components.

```css
/* Bad: This might affect nested components */
.search-form .input {
  /* This affects ALL .input elements inside .search-form,
     even those that belong to nested components */
}

/* Good: This only affects direct children */
.search-form > .input {
  /* This only affects .input elements that are
     direct children of .search-form */
}
```

### 2. Predictable Styling

Child combinators make it easier to predict which elements will be affected by a style rule.

```css
/* Bad: Unpredictable - affects all nested .title elements */
.article-card .title {
}

/* Good: Predictable - only affects direct .title children */
.article-card > .title {
}
```

### 3. Performance

Child combinators are generally more performant than descendant combinators because the browser doesn't need to traverse the entire DOM tree.

### 4. Avoiding Style Conflicts

Descendant combinators can cause unintended style inheritance when components are nested.

```html
<div class="modal">
  <div class="form">
    <div class="input-group">
      <input class="input" />
      <!-- Could be styled by both .modal .input and .form .input -->
    </div>
  </div>
</div>
```

## When Not To Use

This rule should not be used if:

- You're not following RSCSS methodology
- You need to style elements that are not direct children
- You're working with third-party CSS frameworks that rely on descendant combinators
- You have existing CSS that cannot be easily refactored

## Configuration

This rule has no configuration options. It simply detects any use of descendant combinators (spaces) between class selectors.
