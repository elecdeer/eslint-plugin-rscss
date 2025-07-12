# eslint-plugin-rscss

[![CI](https://github.com/elecdeer/eslint-plugin-rscss/workflows/CI/badge.svg)](https://github.com/elecdeer/eslint-plugin-rscss/actions)

ESLint plugin for enforcing [RSCSS](https://web.archive.org/web/20220317015429/https://rscss.io/) (Reasonable System for CSS Stylesheet Structure) conventions in your CSS code.

## 🚀 Features

- **Class Format Validation**: Enforce RSCSS naming conventions for components, elements, variants, and helpers
- **Descendant Combinator Prevention**: Enforce direct child combinator (`>`) usage instead of descendant combinators (space)
- **Configurable Rules**: Customize naming patterns, depth limits, and whitelist exceptions
- **TypeScript Support**: Full TypeScript support with comprehensive type definitions
- **Modern ESLint**: Built for ESLint v9.6.0+ with CSS parsing support

## 📦 Installation

```bash
# npm
npm install --save-dev eslint-plugin-rscss

# yarn
yarn add --dev eslint-plugin-rscss

# pnpm
pnpm add --dev eslint-plugin-rscss
```

## ⚠️ Requirements

- **ESLint**: v9.6.0 or higher (peer dependency)
- **@eslint/css**: v0.10.0 or higher (peer dependency)
- **Node.js**: v22 or higher

## 🔧 Setup

### 1. Install required peer dependencies

```bash
npm install --save-dev @eslint/css
```

### 2. Configure ESLint

Add the plugin to your ESLint configuration:

```js
// eslint.config.js
import rscss from "eslint-plugin-rscss";

export default [
  {
    files: ["**/*.css"],
    plugins: {
      rscss,
    },
    rules: {
      "rscss/class-format": "error",
      "rscss/no-descendant-combinator": "error",
    },
  },
];
```

### 3. Use recommended configuration (optional)

```js
// eslint.config.js
import rscss from "eslint-plugin-rscss";

export default [rscss.configs.recommended];
```

## 📋 Rules

| Rule                                                                     | Description                                      | Recommended |
| ------------------------------------------------------------------------ | ------------------------------------------------ | ----------- |
| [rscss/class-format](docs/rules/class-format.md)                         | Enforces RSCSS class naming conventions          | ✅          |
| [rscss/no-descendant-combinator](docs/rules/no-descendant-combinator.md) | Prevents descendant combinators in CSS selectors | ✅          |

## 🎯 RSCSS Methodology

[RSCSS](https://web.archive.org/web/20220317015429/https://rscss.io/) is a methodology for organizing CSS with component-based architecture:

### Components

Multi-word class names with hyphens:

```css
.search-form {
}
.article-card {
}
```

### Elements

Single-word class names, descendants of components:

```css
.search-form > .input {
}
.search-form > .button {
}
```

### Variants

Modifications of components or elements, prefixed with a dash:

```css
.search-form.-compact {
}
.button.-primary {
}
```

### Helpers

Utility classes for common patterns, prefixed with an underscore:

```css
._clearfix {
}
._text-center {
}
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/eslint-plugin-rscss.git
cd eslint-plugin-rscss

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the plugin
pnpm build

# Type checking
pnpm check:type

# Lint and format
pnpm check:lint
pnpm fix:lint
```

### Project Structure

```
eslint-plugin-rscss/
├── src/
│   ├── index.ts                      # Plugin entry point
│   ├── config.ts                     # Recommended configuration
│   └── rules/
│       ├── class-format.ts           # RSCSS class naming rule
│       └── no-descendant-combinator.ts # Descendant combinator rule
├── docs/
│   └── rules/
│       ├── class-format.md           # class-format rule documentation
│       └── no-descendant-combinator.md # no-descendant-combinator rule documentation
├── tests/                            # Test files
├── dist/                             # Built output
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Run the test suite (`pnpm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RSCSS methodology](https://web.archive.org/web/20220317015429/https://rscss.io/)
- [stylelint-rscss](https://github.com/rstacruz/stylelint-rscss) - The original Stylelint implementation
- ESLint team for the excellent plugin architecture

## 📚 Related Projects

- [elecdeer/stylelint-rscss](https://github.com/elecdeer/stylelint-rscss) - Fork of the original Stylelint plugin
