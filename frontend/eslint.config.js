import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";


export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    settings: { react: { version: "detect" } },
    rules: {
      "no-unused-vars": "off",
      "no-empty": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
      "react/jsx-key": "off",
    },
  },
];
