/*
 * @Author: water.li
 * @Date: 2024-09-07 22:14:42
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipes\file\max-file-size.validator.ts
 */
import { BadRequestException } from "@nestjs/common";
import { FileValidator } from "./file-validator";

export class MaxFileSizeValidator extends FileValidator {
  isValid(file?: any): boolean | Promise<boolean> {
    if (file.size > this.validationOptions.maxSize) {
      throw new BadRequestException(
        `Validation failed (excepted size is less than ${this.validationOptions.maxSize})`
      );
    }
    return true;
  }
}
