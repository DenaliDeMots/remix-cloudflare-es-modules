const { copy } = require("esbuild-plugin-copy");
const { build } = require("esbuild");
build({
  entryPoints: ["./worker/worker.ts"],
  bundle: true,
  sourcemap: true,
  format: "cjs",
  outfile: "./dist/worker.js",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  plugins: [
    copy({
      assets: {
        from: ["./worker/shim.mjs"],
        to: ["."],
      },
    }),
  ],
}).catch(() => process.exit(1));
