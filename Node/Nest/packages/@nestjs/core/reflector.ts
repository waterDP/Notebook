/*
 * @Author: water.li
 * @Date: 2024-09-01 17:05:51
 * @Description: ctr
 * @FilePath: \Notebook\Nest\src\@nestjs\core\reflector.ts
 */
import "reflect-metadata";
import { SetMetadata } from "../common/set-metadata.decorator";

export class Reflector {
  get(metadataKey, target, key?) {
    return key
      ? Reflect.getMetadata(metadataKey, target, key)
      : Reflect.getMetadata(metadataKey, target);
  }
  static crateDecorator() {
    function decoratorFunctory(metadataValue) {
      return SetMetadata(decoratorFunctory, metadataValue);
    }
    return decoratorFunctory;
  }
}
