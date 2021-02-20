import { LoggerService } from '@nestjs/common';

export class NestLogger implements LoggerService {

  log(message: string, source?: string) {
    console.log(`${message}\n [SOURCE]: ${source}`);
  }
  info(message: string, source?: string) {
    console.info(`${message}\n [SOURCE]: ${source}`);
  }
  warn(message: string, source?: string) {
    console.warn(`${message}\n [SOURCE]: ${source}`);
  }
  debug(message: string, source?: string) {
    console.debug(`${message}\n [SOURCE]: ${source}`);
  }
  error(message: string, source?: string) {
    console.error(`${message}\n [SOURCE]: ${source}`);
  }
}
