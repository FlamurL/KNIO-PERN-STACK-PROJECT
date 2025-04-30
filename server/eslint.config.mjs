import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintComments from "eslint-plugin-eslint-comments";
import jest from "eslint-plugin-jest";
import promise from "eslint-plugin-promise";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import airbnbBase from "eslint-config-airbnb-base";
import airbnbTypeScript from "eslint-config-airbnb-typescript/base.js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ["node_modules/", "dist/", "build/"], // Moved ignores here
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "eslint-comments": eslintComments,
      jest,
      promise,
      import: importPlugin,
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "import/prefer-default-export": "off",
      "import/no-default-export": "error",
      "no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true, typedefs: true },
      ],
      "import/no-extraneous-dependencies": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    extends: [
      pluginJs.configs.recommended,
      tseslint.configs.recommended,
      eslintComments.configs.recommended,
      jest.configs.recommended,
      promise.configs.recommended,
      prettier.configs.recommended,
      airbnbBase,
      airbnbTypeScript,
    ],
  },
];
