/*
 * @Author: water.li
 * @Date: 2024-08-31 21:08:09
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipes\parse-bool.pipe.ts
 */
import { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "../http-exception";

export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value.toLowerCase() === "true") {
      return true;
    }
    if (value.toLowerCase() === "false") {
      return false;
    }

    throw new BadRequestException(
      `Validation failed (boolean string is expected)`
    );
  }
}
