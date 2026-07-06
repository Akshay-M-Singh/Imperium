import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

// Flat config. We use @next/eslint-plugin-next's native flatConfig export
// (instead of `eslint-config-next`, which depends on the @rushstack/eslint-patch
// and is incompatible with ESLint 9 flat mode).

const nextCoreWebVitals = nextPlugin.flatConfig.coreWebVitals;

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "playwright-report/**",
      "test-results/**",
      "playwright/.cache/**",
      "out/**",
      "coverage/**",
      ".fonts-source/**",
      "next-env.d.ts",
      "**/*.module.css.d.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextCoreWebVitals,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["warn", { usePrettierRc: true }],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettierConfig,
);
