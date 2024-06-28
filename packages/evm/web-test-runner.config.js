const { esbuildPlugin } = require("@web/dev-server-esbuild");

module.exports = {
  files: "./test/web/**/*.test.ts",
  plugins: [esbuildPlugin({ ts: true })],
  nodeResolve: true,
};
