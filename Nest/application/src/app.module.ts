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
import {
  AcceptLanguageResolver,
  QueryResolver,
  I18nModule
} from "nestjs-i18n"
import * as path from 'path'

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // 默认语言
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        AcceptLanguageResolver
      ]
    }),
    SharedModule,
    AdminModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
