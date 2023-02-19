require("esbuild").buildSync({
  entryPoints: ["main.js"],
  loader: {
    ".js": "jsx",
  },
  outfile: "out.js",
});
