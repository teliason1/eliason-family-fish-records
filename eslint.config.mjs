import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";
const dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: dirname });
const config = [...compat.extends("next/core-web-vitals", "next/typescript"), { ignores: [".next/**", "public/fish/**", "data/records.json", "next-env.d.ts"] }];
export default config;
