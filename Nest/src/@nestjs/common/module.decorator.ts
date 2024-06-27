import "reflect-metadata";

interface ModuleMetadata {
  controllers: Function[];
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    // todo
  }
}
