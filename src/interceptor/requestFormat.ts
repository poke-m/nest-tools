import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { ResponseEntity, httpStatusOptions, HttpStatusOptions } from '../common';

@Injectable()
export class RequestFormat implements NestInterceptor {

  constructor(readonly options: HttpStatusOptions = httpStatusOptions) {}

  format(data: any, response: Response, requestId: string) {
    const status = this.options.status.get(response.statusCode);

    return {
      requestId,
      code: status.code || response.statusCode,
      errorCode: status.errorCode || '',
      message: status[this.options.language],
      timestamp: Date.now(),
      data: data || null,
    };
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<ResponseEntity<any>> {

    return next.handle().pipe(
      map((responseData: ResponseEntity<any>) => {
        const request: Request = ctx.switchToHttp().getRequest();
        const response: Response = ctx.switchToHttp().getResponse();
        const requestId = (request.headers['x-request-id'] as string);
        const contentType = request.headers['content-type'] || 'application/json; charset=utf-8';

        /**
         * only deal json & x-www-form-urlencoded
         */
        if (
          contentType.includes('application/json') ||
          contentType.includes('application/x-www-form-urlencoded')
        ) {
          return this.format(responseData, response, requestId);
        }

        return responseData;
      }),
    );
  }
}
