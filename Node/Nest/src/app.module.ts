import { Module } from '@nestjs/common';
import { AdminModule } from './module/admin/admin.module';
import { ApiModule } from './module/api/api.module';
import { DefaultModule } from './module/default/default.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AdminModule, ApiModule, DefaultModule],
})
export class AppModule {}
