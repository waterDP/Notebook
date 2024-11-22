import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [AdminModule, SharedModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
