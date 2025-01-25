/*
 * @Author: water.li
 * @Date: 2025-01-04 12:19:18
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\shared\middlewares\method-override.ts
 */

import { Request, Response, NextFunction } from 'express';

function methodOverride(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method.toUperCase();
    delete req.body._method
    // req.method = method;
  }
  next();
}

export default methodOverride;
