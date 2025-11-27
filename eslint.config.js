const js = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');
const prettier = require('eslint-config-prettier');

/** @type {import('eslint').Linter.FlatConfigArray} */
module.exports = [
  js.configs.recommended,
  prettier,

  // --- 1. CONFIG FOR COMMONJS FILES (The Default) ---
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2021,
      // Default: Assume CommonJS since "type": "commonjs" in package.json
      sourceType: 'commonjs',

      globals: {
        console: 'readonly',
        process: 'readonly',
        // CommonJS Globals needed for files using require() and module.exports
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      complexity: ['warn', 10],
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // --- 2. CONFIG FOR ES MODULE FILES (Overrides sourceType) ---
  // Apply this to files that explicitly use 'import' or 'export'.
  // We'll target files that were causing the "Parsing error"
  {
    files: [
      '**/exampleController.js',
      '**/middleware/exampleMiddleware.js',
      '**/routes/index.js',
      '**/start.js',
      '**/jest.config.js', // jest.config.js is using 'export default'
      // Add any other files using 'import' or 'export' here
    ],
    languageOptions: {
      // 🔑 FIX: Override to 'module' for files using 'import'/'export' syntax
      sourceType: 'module',

      // We still need Node globals, but the file uses ESM syntax
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    // The rules and plugins are inherited from the main config
  },
  // --- 3. CONFIG FOR JEST TEST FILES ---
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        // 🔑 FIX: Add the missing Jest globals (beforeAll/afterAll/jest)
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        jest: 'readonly',
      },
    },
  },
];
