import { fileURLToPath } from "node:url";
import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import js from "@eslint/js";
import path from "node:path";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactRefresh from "eslint-plugin-react-refresh";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist", "**/.eslintrc.cjs"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: {
        version: "18.2",
      },
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    files: ["**/*.jsx"],
    rules: {
      "react/prop-types": "warn",
      "react/jsx-no-target-blank": "off",

      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      "operator-linebreak": ["error", "before"],
    },
  },
  pluginJs.configs.recommended,

  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:react/jsx-runtime",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    )
  ),
];
