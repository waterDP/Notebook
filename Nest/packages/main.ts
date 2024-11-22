/*
 * @Author: water.li
 * @Date: 2024-06-23 22:21:42
 * @Description:
 * @FilePath: \Notebook\Nest\src\main.ts
 */
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(  
    session({
      secret: "your-secret-key",
      resave: false, // 在每次请求结束后是否强制保存会话，即使它没有改变
      saveUninitialized: false, // 是否保存未初始化的会话
      cookie: {
        // 定义会话的cookie配置，设置cookie的最大存活时间为一天
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
