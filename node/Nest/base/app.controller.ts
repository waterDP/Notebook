import {Get, Controller} from '@nestjs/common'
import {AppService} from './app.service'

@Controller('/')
export class AppController {
  constructor(private appService: AppService){

  }

  @Get('/hello')
  hello() {
    let message = this.appService.getHello()
    return message
  }
}