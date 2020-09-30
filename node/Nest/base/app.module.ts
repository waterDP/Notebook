import { UseClassLoggerService } from './logger.service';
import {Module} from "@nestjs/common"
import {AppController} from './app.controller'
import {AppService} from './app.service'

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: UseClassLoggerService, // token
      useClass: UseClassLoggerService // 注册的是一个类
    }
  ]
})
export class AppModule {

}