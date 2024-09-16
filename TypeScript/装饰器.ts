/*
 * @Author: water.li
 * @Date: 2024-09-16 13:53:48
 * @Description:
 * @FilePath: \Notebook\TypeScript\装饰器.ts
 */

// @ts-nocheck

import "reflect-metadadata";

// 1. 类装饰器
const classDecorator = <T extends new (...args: any[]) => void>(target: T) => {
  Object.assign(target.prototype, {
    eat() {},
    drink() {},
  });
};

function OverrideAnimal<T extends new (...args: any[]) => any>(target: T) {
  return class extends target {
    eat() {
      super.eat();
      console.log("override eat");
    }
  };
}

@classDecorator
@OverrideAnimal
class Animal {}

// 2. 方法装饰器

function Enum(isEnum: boolean): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    descriptor.enumerable = isEnum;
  };
}

class Animal1 {
  @Enum(true)
  eat() {
    console.log("eat");
  }
}

function ToUpper(): PropertyDecorator {
  return (target, propertyKey) => {
    let val = "";
    Object.defineProperty(target, propertyKey, {
      get() {
        return val.toUpperCase();
      },
      set(v) {
        val = v;
      },
    });
  };
}

// 3. 属性装饰器
class Animal2 {
  @ToUpper()
  public name: string = "animal";
}

const REQUIRED_KEY = Symbol();
const VALUE_DATA_TYPE = Symbol();
function Required(): PropertyDecorator {
  return (target, propertyKey) => {
    const requiredKeys = Reflect.getMetadata(REQUIRED_KEY, target) || [];
    Reflect.defineMetadata(
      REQUIRED_KEY,
      [...requiredKeys, propertyKey],
      target
    );
  };
}

enum Type {
  String = "string",
  Number = "number",
}

function ValueType(type: Type): PropertyDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata(VALUE_DATA_TYPE, type, target, propertyKey);
  };
}

class Person {
  @ValueType(Type.String)
  @Required()
  name!: string;

  @ValueType(Type.Number)
  @Required()
  age!: number;
}

const p = new Person();

function validate(instance: object) {
  const existsKeys = Reflect.ownKeys(instance);
  // @ts-ignore
  const requiredKeys = Reflect.getMetadata(REQUIRED_KEY, instance);
  for (let key of requiredKeys) {
    const validata_type = Reflect.getMetadata(VALUE_DATA_TYPE, instance, key);
    if (validata_type) {
      if (typeof instance[key] !== validata_type) {
        throw new Error(`${key} is not ${validata_type}`);
      }
    }
    if (!existsKeys.includes(key)) {
      throw new Error(`${key} is required`);
    }
  }
}

// @ts-ignore 不管有没有错误，都不会报错
// @ts-expect-error 我确定下一行是有错误的
// @ts-nocheck 丧失对整个文件校验
// @ts-check js-doc 开启校验
validate(p);
