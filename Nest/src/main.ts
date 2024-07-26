import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: "your-secret-key",
      resave: false, // 在每次请求结束后是否强制保存会话，即使它没有改变
      saveUninitialized: false, // 是否保存未初始化的会话
      cookie: {  // 定义会话的cookie配置，设置cookie的最大存活时间为一天
        maxAge: 1000 * 60 * 60 * 24
      }
    })
  );
  await app.listen(3000);
}

bootstrap();
