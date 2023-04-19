function normalizePath(path) {
  return path.replace(/\\/g, "/");
}
exports.normalizePath = normalizePath;

const knowJSSrcRE = /\.js/;
const isJSRequest = (url) => {
  return knowJSSrcRE.test(url);
};
exports.isJSRequest = isJSRequest;
