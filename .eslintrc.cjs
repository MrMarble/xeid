module.exports = {
  env: {
    browser: true,
    es2020: true,
    mocha: true
  },
  extends: ["eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:wdio/recommended",
    "prettier",
    "plugin:storybook/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react-refresh", "wdio", "simple-import-sort"],
  rules: {
    "react-refresh/only-export-components": "warn",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
};