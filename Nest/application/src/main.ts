import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { join } from 'path';
import { engine } from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 配置静态文件根目录
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 配置模板文件的根目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 定义模板引擎
  app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      runtimeOptions: {
        allowProtoMethodsByDefault: true, // 允许使用原型方法
        allowProtoPropertiesByDefault: true, // 允许使用原型属性
      },
    }),
  );
  // 设置渲染模型文件的引擎为hbs
  app.set('view engine', 'hbs');
  app.use(cookieParser());
  app.use(
    session({
      secret: 'secret-key',
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // 创建一个新的DocumentBuilder实例, 用于配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('CMS API 描述')
    .setVersion('1.0')
    .addTag('CMS')
    .build();
  // 使用配置对象创建Swagger文档
  const document = SwaggerModule.createDocument(app, config)  
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
