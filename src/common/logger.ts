import { LoggerService } from '@nestjs/common';

/**
 * default logger
 */
export class NestLogger implements LoggerService {
  log(message: string, source = 'logger') {
    console.log(`${message}\n[source]: ${source}`);
  }
  info(message: string, source = 'logger') {
    console.info(`${message}\n[source]: ${source}`);
  }
  warn(message: string, source = 'logger') {
    console.warn(`${message}\n[source]: ${source}`);
  }
  debug(message: string, source = 'logger') {
    console.debug(`${message}\n[source]: ${source}`);
  }
  error(message: string, source = 'logger') {
    console.error(`${message}\n[source]: ${source}`);
  }
}
