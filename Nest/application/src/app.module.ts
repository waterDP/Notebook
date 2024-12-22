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

@Module({
  imports: [
    SharedModule,
    AdminModule,
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
