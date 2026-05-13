import { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "../http-exception";

export class ParseFloatPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseFloat(value);
    if (isNaN(val)) {
      throw new BadRequestException(
        `Validation failed (float string is expected)`
      );
    }
    return val;
  }
}
