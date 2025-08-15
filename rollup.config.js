// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";

const pkg = require("./package.json"); // ✅ Works in CJS config

export default [
    {
        input: "src/index.ts",
        output: [
            { file: pkg.main, format: "cjs", sourcemap: true },
            { file: pkg.module, format: "esm", sourcemap: true },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            json(),
            typescript({ tsconfig: "./tsconfig.json" }),
        ],
    },
    {
        input: "src/index.ts",
        output: [{ file: pkg.types, format: "es" }],
        plugins: [dts()],
    },
];
