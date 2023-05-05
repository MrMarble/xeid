import * as esbuild from "https://deno.land/x/esbuild@v0.17.18/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts";

await esbuild.build({
  plugins: [
    {
      name: "json",
      setup: (build) =>
        build.onLoad({ filter: /\.json$/ }, () => ({ loader: "json" })),
    },
    ...denoPlugins({
      configPath: `${
        new URL(".", import.meta.url).pathname.substring(1)
      }deno.json`,
    }),
  ],
  entryPoints: ["./www/index.tsx"],
  outfile: "./www/dist/main.js",
  bundle: true,
  format: "esm",
  minify: true,
  treeShaking: true,
  target: "es2020",
  platform: "browser",
  define: {
    "IS_PRODUCTION": "true",
  },
  publicPath: "./src-tauri/icons",
});

esbuild.stop();
