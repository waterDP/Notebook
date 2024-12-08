/*
 * @Author: water.li
 * @Date: 2024-11-22 21:27:39
 * @Description:
 * @FilePath: \Notebook\Nest\application\src\app.module.ts
 */
import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';
import { LoggerModule } from './logger/logger.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
const { combine, timestamp, printf } = winston.format;

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: combine(
            timestamp(),
            printf(({ level, message, timestamp }) => {
              return `[Nest] ${process.pid} - ${timestamp} ${level} [] ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
      ],
    }),
    LoggerModule,
    SharedModule,
    AdminModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
