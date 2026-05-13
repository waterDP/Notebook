import { PipeTransform } from "@nestjs/common";
import { BadRequestException } from "../http-exception";

interface ParseArrayOptions {
  items: any;
  seperator?: string;
}

export class ParseArrayPipe implements PipeTransform<string, any[]> {
  constructor(private readonly options: ParseArrayOptions) {}
  transform(value: string): any[] {
    if (!value) {
      return [];
    }
    const { items = String, seperator = "," } = this.options ?? {};
    return value.split(seperator).map((item) => {
      if (items === String) {
        return item;
      }
      if (items === Number) {
        const val = Number(item);
        if (isNaN(val)) {
          throw new BadRequestException(
            "Validation failed (number is expected)"
          );
        }
        return val;
      }
      if (items === Boolean) {
        if (item.toLowerCase() === "true") {
          return true;
        }
        if (item.toLowerCase() === "false") {
          return false;
        }

        throw new BadRequestException(
          `Validation failed (boolean string is expected)`
        );
      }
    });
  }
}
