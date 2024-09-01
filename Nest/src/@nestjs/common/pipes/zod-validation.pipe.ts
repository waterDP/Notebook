import { PipeTransform } from "@nestjs/common";
import { ArgumentMetadata } from '../argument-metadata.interface';
import { ZodSchema } from "zod";
import { BadRequestException } from '../http-exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {

  }
  transform(value: any, metadata?: ArgumentMetadata) {
    try {
      // value 是传进来的值，使用zodSchema进行解析验证，如果通过则返回解析后的值
      return this.schema.parse(value)
    } catch(error) {
      // 如果解析失败，则抛出异常
      throw new BadRequestException('validation failed')
    }
  }
  
}