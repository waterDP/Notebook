/*
 * @Author: water.li
 * @Date: 2024-09-07 22:07:25
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipes\file\file-type.validator.ts
 */
import { FileValidator } from "./file-validator";
import { BadRequestException } from "../../http-exception";

export class FileTypeValidator extends FileValidator {
  isValid(file?: any): boolean | Promise<boolean> {
    if (file.mimeType !== this.validationOptions.fileType) {
      throw new BadRequestException(
        `Validation failed (excepted type is ${this.validationOptions.fileType})`
      );
    }
    return true;
  }
}
