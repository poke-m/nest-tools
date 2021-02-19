import { LoggerService } from '@nestjs/common';

export class NestLogger implements LoggerService {

  log(message: string, source?: string) {
    console.log(message);
    console.log(source);
  }
  info(message: string, source?: string) {
    console.log(message);
    console.log(source);
  }
  warn(message: string, source?: string) {
    console.log(message);
    console.log(source);
  }
  debug(message: string, source?: string) {
    console.log(message);
    console.log(source);
  }
  error(message: string, source?: string, trace?: string) {
    console.log(message);
    console.log(source);
    console.log(trace);
  }
}
