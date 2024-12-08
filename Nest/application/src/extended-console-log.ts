/*
 * @Author: water.li
 * @Date: 2024-12-08 10:55:28
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\extended-console-log.ts
 */
import { ConsoleLogger } from '@nestjs/common';

export class ExtendedConsoleLogger extends ConsoleLogger {
  log(message: any, stack?: string, context?: string) {
    console.log('ExtendedConsoleLogger.log');
    super.log(message, stack, context);
  }
}
