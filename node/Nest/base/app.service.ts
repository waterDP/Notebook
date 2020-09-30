import { UseClassLoggerService } from './logger.service';
import {Injectable} from "@nestjs/common"

@Injectable()
export class AppService {
  constructor(private useClassLoggerService: UseClassLoggerService) {

  }
  getHello() {
    this.useClassLoggerService.log('useClassLoggerServices')
    return 'hello'
  }
}