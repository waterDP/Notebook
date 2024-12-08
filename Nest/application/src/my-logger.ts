import { Inject, Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
  @Inject('LOGGER_CONFIG') private readonly config: any;
  log(message: any, ...optionalParams: any[]) {
    if (this.config.enable) {
      console.log(`[LOG] ${message}`, ...optionalParams);
    }
  }
  error(message: any, ...optionalParams: any[]) {
    console.log(`[ERROR] ${message}`, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.log(`[WARN] ${message}`, ...optionalParams);
  }
  debug(message: any, ...optionalParams: any[]) {
    console.log(`[DEBUG] ${message}`, ...optionalParams);
  }
  verbose(message: any, ...optionalParams: any[]) {
    console.log(`[VERBOSE] ${message}`, ...optionalParams);
  }
  fatal(message: any, ...OptionalParams: any[]) {
    console.log(`[FATAL] ${message}`, ...OptionalParams);
  }
}
