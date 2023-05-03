import * as esbuild from "https://deno.land/x/esbuild@v0.17.18/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts";

const ctx = await esbuild.context({
  entryPoints: ["./www/index.tsx"],
  outfile: "./www/dist/main.js",
  bundle: true,
  format: "esm",
  target: "es2020",
  platform: "browser",
  plugins: [
    {
      name: "json",
      setup: (build) =>
        build.onLoad({ filter: /\.json$/ }, () => ({ loader: "json" })),
    },
    ...denoPlugins(),
  ],
  publicPath: "./www/public",
});

await ctx.watch();

await ctx.serve({
  servedir: "./www",
  port: 3000,
});
