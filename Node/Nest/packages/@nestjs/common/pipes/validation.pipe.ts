/*
 * @Author: water.li
 * @Date: 2024-09-01 14:28:57
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipes\validation.pipe.ts
 */
import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from "@nestjs/common";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata?: ArgumentMetadata) {
    if (!metadata.metatype || !this.needValidate(metadata.metatype)) {
      return value;
    }
    const instance = plainToInstance(metadata.metatype, value);
    const errors = await validate(instance);
    if (errors.length) {
      throw new BadRequestException(this.formateErrors(errors));
    }
    return value;
  }
  private formateErrors(errors: ValidationError[]) {
    return errors
      .map((error) => {
        for (const property in error.constraints) {
          return `${error.property} - ${error.constraints[property]}`;
        }
      })
      .join(",");
  }
  private needValidate(metatype: Function): boolean {
    const types: Function[] = [String, Number, Boolean, Array, Object];
    return !types.includes(metatype);
  }
}
