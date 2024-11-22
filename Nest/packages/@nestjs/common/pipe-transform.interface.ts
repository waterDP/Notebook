/*
 * @Author: water.li
 * @Date: 2024-08-31 20:35:36
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipe-transform.interface.ts
 */
import { ArgumentMetadata } from "@nestjs/common";

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata?: ArgumentMetadata): R;
}
