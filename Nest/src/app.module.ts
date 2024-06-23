import { AppController } from "./app.controller";
import { Module } from "@nestjs/common";

@Module({
  controllers: [AppController],
})
export class AppModule {

}

/**
 * @module 是一个装饰器，用于定义模块
 * 模块是组织代码的基本单元，它将相关的组件（控制器，服务器，提供者）组合在一起
 */