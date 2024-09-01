import "reflect-metadata";

export class Reflector {
  get(metadataKey, target, key?) {
    return key
      ? Reflect.getMetadata(metadataKey, target, key)
      : Reflect.getMetadata(metadataKey, target);
  }
}
