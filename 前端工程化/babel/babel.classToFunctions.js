const babel = require("@babel/core");
const types = require("@babel/types");

const code = `
  class Person {
    constructor(name) {
      this.name = name
    }
    getName() {
      return this.name
    }
  }
`;

const classToFunctions = {
  visitor: {
    ClassDeclaration(path) {
      const { node } = path;
      const { id } = node;
      const classMethods = node.body.body;
      const newNodes = [];
      classMethods.forEach((classMethod) => {
        if (classMethod.kind === "constructor") {
          const constructor = types.functionDeclaration(
            id,
            classMethod.params,
            classMethod.body
          );
          newNodes.push(constructor);
        } else {
          const AssignmentExpression = types.assignmentExpression(
            "=",
            types.memberExpression(
              types.memberExpression(id, types.identifier("prototype")),
              classMethod.key
            ),
            types.functionExpression(null, classMethod.params, classMethod.body)
          );
          newNodes.push(AssignmentExpression);
        }
      });
      if (newNodes.length === 1) {
        path.replaceWith(newNodes[0]);
      } else {
        path.replaceWithMultiple(newNodes);
      }
    },
  },
};

const result = babel.transform(code, {
  plugins: [classToFunctions],
});

console.log(result.code);
