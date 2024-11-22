import "reflect-metadata";
import { INJECTED_TOKENS } from "./constants";

export function Inject(token: string): ParameterDecorator {
  return (target: Object, propertyKey: string, parameterIndex: number) => {
    const existingInjectToken =
      Reflect.getMetadata(INJECTED_TOKENS, target) ?? [];

    existingInjectToken[parameterIndex] = token;
    Reflect.defineMetadata(INJECTED_TOKENS, existingInjectToken, target);
  };
}
