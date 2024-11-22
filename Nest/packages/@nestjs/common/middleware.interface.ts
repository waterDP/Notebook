/*
 * @Author: water.li
 * @Date: 2024-08-18 17:40:29
 * @Description:
 * @FilePath: \Notebook\Nest\src\@nestjs\common\middleware.interface.ts
 */
import { Request, Response, NextFunction } from "express";

export interface NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void;
}
