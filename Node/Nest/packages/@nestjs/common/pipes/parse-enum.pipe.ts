/*
 * @Author: water.li
 * @Date: 2024-08-31 21:40:47
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipes\parse-enum.pipe.ts
 */
import { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "../http-exception";

export class ParseEnumPipe implements PipeTransform<string, string> {
  constructor(private readonly enumType: any[]) {}
  transform(value: string): string {
    const enumValues = Object.values(this.enumType);
    if (!enumValues.includes(value)) {
      throw new BadRequestException(
        `Validation failed (${value}) is not a valid enum`
      );
    }
    return value;
  }
}
