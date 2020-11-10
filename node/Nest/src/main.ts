import {NestFactory} from "@nestjs/core"
import {AppModule} from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as path from 'path'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  // app.useGlobalGuards() 全局守卫
  // todo 配置静态资源目录
  app.useStaticAssets(path.join(__dirname, '..', 'public'))
  // todo 配置模板引擎
  app.setBaseViewsDir('views')
  app.setViewEngine('ejs')

  // todo 配置cookie中间件
  app.use(cookieParser())

  // todo 配置session中间件  
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 219000, httpOnly: true },
    rolling: true
  }))
  
  await app.listen(3000)
}

bootstrap()