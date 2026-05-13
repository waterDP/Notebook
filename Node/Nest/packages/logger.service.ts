/*
 * @Author: water.li
 * @Date: 2024-08-04 10:36:49
 * @Description:
 * @FilePath: \Notebook\Nest\src\logger.service.ts
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log('loggerService:', message)
  }
}
