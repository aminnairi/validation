/**
 * Validation library for forms written in TypeScript
 * Copyright (C) 2022 Amin NAIRI
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://github.com/aminnairi/validation>.
 */
import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";
import remove from "rollup-plugin-delete";
import tsconfig from "./tsconfig.json";

export default defineConfig([
  {
    input: resolve("sources", "index.ts"),
    plugins: [
      remove({
        targets: resolve("build", "*")
      }),
      typescript({
        tsconfig: "tsconfig.rollup.json"
      }),
      terser()
    ],
    output: [
      {
        file: resolve(tsconfig.compilerOptions.outDir, "index.common.js"),
        format: "cjs"
      },
      {
        file: resolve(tsconfig.compilerOptions.outDir, "index.module.js"),
        format: "esm"
      },
      {
        file: resolve(tsconfig.compilerOptions.outDir, "index.browser.js"),
        format: "iife",
        name: "@aminnairi/validation",
        extend: true
      }
    ]
  }
]);