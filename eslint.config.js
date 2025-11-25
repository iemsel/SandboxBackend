import js from "@eslint/js";
import pluginNode from "eslint-plugin-node";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,

  {
    // apply to JS files
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    plugins: {
      node: pluginNode,
      prettier: pluginPrettier
    },
    settings: {},
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // keep plugin-node recommended rules (merge if needed)
      ...pluginNode.configs.recommended.rules,

      // TEAM RULES - Should be discussed
      quotes: ["error", "single"],
      semi: ["error", "always"],
      complexity: ["warn", 10],

      // If ESM is used
      "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],

      // small pods
      "no-console": "off"
    }
  }
];
