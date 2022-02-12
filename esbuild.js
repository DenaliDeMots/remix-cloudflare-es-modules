const { copy } = require("esbuild-plugin-copy");
const { build } = require("esbuild");

build({
  entryPoints: ["./worker/worker.ts"],
  bundle: true,
  sourcemap: true,
  format: "cjs",
  outfile: "./dist/worker.js",
  minify: process.env.NODE_ENV === "production",
  define: {
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
  },
  external: ["__STATIC_CONTENT_MANIFEST"],
  plugins: [
    copy({
      assets: {
        from: ["./worker/shim.mjs"],
        to: ["."],
      },
    }),
  ],
}).catch(() => process.exit(1));
