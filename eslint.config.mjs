import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest", // Enables modern JS support
      globals: {
        ...globals.node, // Enables Node.js globals (`process`, `__dirname`)
        process: "readonly" // Explicitly allows `process.env`
      }
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended
];