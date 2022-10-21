module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "simple-import-sort"],
  parser: "@typescript-eslint/parser",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: "./",
  },
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
        singleQuote: false,
        semi: true,
        printWidth: 120,
        arrowParens: "always",
      },
    ],
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["\\u0000"], ["^@?\\w"], ["^[^.]"], ["^\\."]],
      },
    ],
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
  },
};
