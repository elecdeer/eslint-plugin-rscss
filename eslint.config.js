import css from '@eslint/css';
import rscssPlugin from './dist/index.js';

export default [
  {
    files: ['**/*.css'],
    plugins: {
      css,
      rscss: rscssPlugin,
    },
    language: 'css/css',
    rules: {
      'rscss/class-format': 'error',
      'rscss/no-descendant-combinator': 'error',
    },
  },
];