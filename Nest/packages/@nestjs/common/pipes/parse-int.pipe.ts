import { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "../http-exception";

export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed (numeric string is expected)`
      );
    }
    return val;
  }
}
