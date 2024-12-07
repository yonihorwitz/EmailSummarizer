import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginReact.configs.flat.recommended,
];