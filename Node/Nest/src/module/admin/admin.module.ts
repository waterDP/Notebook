import { Module } from '@nestjs/common';
import { MainController } from './main/main.controller';
import { LoginController } from './login/login.controller';
import { ManagerController } from './manager/manager.controller';

@Module({
  controllers: [MainController, LoginController, ManagerController]
})
export class AdminModule {}
