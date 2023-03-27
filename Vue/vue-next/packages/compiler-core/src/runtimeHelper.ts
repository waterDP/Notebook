import { NodeType } from "./ast";

export const TO_DISPLAY_STRING = Symbol();
export const CREATE_TEXT = Symbol();

export const helpNameMap = {
  [TO_DISPLAY_STRING]: "toDisplayString",
  [CREATE_TEXT]: "createTextVNode",
};

export function createCallExpression(context, args) {
  context.helper(CREATE_TEXT);
  return {
    type: NodeType.JS_CALL_EXPRESSION,
    arguments: args,
  };
}
