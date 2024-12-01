import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [SharedModule, AdminModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
