---
"eslint-plugin-rscss": minor
---

Initial release of eslint-plugin-rscss

This package provides ESLint rules for enforcing RSCSS (Reasonable System for CSS Stylesheet Structure) conventions:

- **class-format**: Enforces RSCSS class naming conventions with support for components, elements, variants, and helpers
- **no-descendant-combinator**: Prevents descendant combinators in CSS selectors

Features:
- TypeScript support
- Comprehensive configuration options including custom regex patterns
- JSON schema validation for rule options
- Compatible with ESLint v9.6.0+ and @eslint/css parser