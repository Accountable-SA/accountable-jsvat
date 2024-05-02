import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import fs from "fs/promises";

const esmPlugins = [
  nodeResolve(),
  typescript({ tsconfig: "./configs/tsconfig.esm.json" }),
  json(),
];

const cjsPlugins = [
  nodeResolve(),
  typescript({ tsconfig: "./configs/tsconfig.cjs.json" }),
  json(),
];

const files = [...(await getFilesRecursively("src"))];

/** @type {import('rollup').RollupOptions[]} */
const rollupConfig = [
  {
    input: "src/index.ts",
    plugins: esmPlugins,
    output: {
      dir: "lib/esm",
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].mjs",
      format: "esm",
    },
  },
  {
    input: files,
    plugins: cjsPlugins,
    output: {
      dir: "lib/cjs",
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].cjs",
      format: "cjs",
    },
  },
];

/**
 *
 * @param {string} dir
 * @param {Set<string>} [set]
 * @param {string} [prefix]
 * @returns {Promise<Set<string>>}
 */
async function getFilesRecursively(dir, set = new Set()) {
  const files = await fs.readdir(dir);

  await Promise.all(
    files.map(async (file) => {
      const path = `${dir}/${file}`;
      const stat = await fs.stat(path);

      if (stat.isDirectory()) {
        await getFilesRecursively(path, set);
      } else {
        set.add(path);
      }
    })
  );

  return set;
}

export default rollupConfig;
