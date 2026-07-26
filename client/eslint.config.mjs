import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Reglas para servicios y hooks: prohibir uso directo de fetch/axios/fetcher
    files: ["src/services/**/*.js", "src/hooks/**/*.js"],
    ignores: ["src/services/translation.js"], // Excepción: translation.js usa ruta interna de Next.js
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message: "Usa apiClient de @/lib/api/client.js en lugar de fetch directo.",
        },
        {
          selector: "ImportDeclaration[source.value='axios']",
          message: "Usa apiClient de @/lib/api/client.js en lugar de importar axios directamente.",
        },
        {
          selector: "ImportDeclaration[source.value='@/lib/fetcher']",
          message: "Usa apiClient de @/lib/api/client.js en lugar de fetcher. fetcher será deprecado.",
        },
      ],
    },
  },
]);

export default eslintConfig;
