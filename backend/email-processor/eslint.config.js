import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
        Buffer: true,
      }
    }
  },
  pluginJs.configs.recommended,
];