/*
 * @Author: water.li
 * @Date: 2024-08-31 20:35:36
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\pipe-transform.interface.ts
 */

export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadata?: any): R;
}
