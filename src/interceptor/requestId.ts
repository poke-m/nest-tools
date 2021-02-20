import { Request } from 'express';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { NestLogger } from '../common';
import { getIpByRequest } from '../ip';

@Injectable()
export class RequestId implements NestInterceptor {

  constructor(private readonly logger: NestLogger) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = ctx.switchToHttp().getRequest();
    const ip = getIpByRequest(request);
    const { originalUrl, method, headers } = request;
    headers['x-request-id'] = headers['x-request-id'] || uuid();

    this.logger.info(`[${method}] ${originalUrl} [x-request-id] : ${headers['x-request-id']}`, ip);
    return next.handle().pipe((responseData: any) => responseData);
  }

}
