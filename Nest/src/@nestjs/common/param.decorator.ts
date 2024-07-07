import "reflect-metadata";

export const createParamDecorator = (key: string) => {
  return () => (target: any, propertyKey: string, parameterIndex: number) => {
    // 给控制器类的原型的propertyKey也就是handleRequest方法属性上添加元数据
    // ^ 属性名是params:handleRequest 值是一个数组，数组里的值表示，哪个位置使用哪个头饰器
    const existingParameters =
      Reflect.getMetadata("params", target, propertyKey) || [];
    existingParameters[parameterIndex] = { parameterIndex, key };
    Reflect.defineMetadata(`params`, existingParameters, target, propertyKey);
  };
};

export const Request = createParamDecorator("Request");
export const Req = createParamDecorator("Req");
