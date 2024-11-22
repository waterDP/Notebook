/*
 * @Author: water.li
 * @Date: 2024-09-01 14:28:57
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipes\class-validation.pipe.ts
 */
import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export class ClassValidationPipe implements PipeTransform {
  async transform(value: any, metadata?: ArgumentMetadata) {
    if (!metadata.metatype || !this.needValidate(metadata.metatype)) {
      return value;
    }
    const instance = plainToInstance(metadata.metatype, value);
    const errors = await validate(instance);
    if (errors.length) {
      throw new BadRequestException("Validationn failed");
    }
    return value;
  }
  private needValidate(metatype: Function): boolean {
    const types: Function[] = [String, Number, Boolean, Array, Object];
    return !types.includes(metatype);
  }
}
