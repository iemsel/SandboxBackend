import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,

  {
    // apply to JS files
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TEAM RULES - Should be discussed
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      complexity: ['warn', 10],

      // Allow console for backend logging
      'no-console': 'off',
    },
  },
  {
    // Jest test files
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
];
