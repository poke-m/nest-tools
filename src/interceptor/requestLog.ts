import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { getIpByRequest } from '../ip';
import { NestLogger, ResponseEntity } from '../common';

@Injectable()
export class RequestLog implements NestInterceptor {

  constructor(private readonly logger: NestLogger) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = ctx.switchToHttp().getRequest();
    const response: Response = ctx.switchToHttp().getResponse();

    const { originalUrl, body, query, method, headers } = request;
    const requestId = headers['x-request-id'];
    const ip = getIpByRequest(request);

    return next.handle().pipe(
      map((responseData: ResponseEntity<any>) => {
        let info = `[Success] [${ctx.getClass().name}] [${method}] ${originalUrl} \n`;

        info += `[Request] [ID]   ${requestId} \n`;
        info += `[Request] [Code] ${response.statusCode}]`;
        info += `[Request] [Query]   ${JSON.stringify(query)} \n`;
        info += `[Request] [Body]    ${JSON.stringify(body)} \n`;
        info += `[Request] [Headers] ${JSON.stringify(headers)} \n`;
        info += `[Response] [Detail]  ${JSON.stringify(responseData)}`;

        if (request['user']) info += `[Request] [User] ${JSON.stringify(request['user'])}`;
        this.logger.info(info, ip);
        return responseData;
      }),
    );
  }
}
