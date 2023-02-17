const walk = require("./walk");

function replaceIdentifier(statement, source, replacements) {
  walk(statement, {
    enter(node) {
      if (node.type === "Identifier") {
        if (node.name && replacements[node.name]) {
          source.overwrite(node.start, node.end, replacements[node.name]);
        }
      }
    },
  });
}

exports.replaceIdentifier = replaceIdentifier;
