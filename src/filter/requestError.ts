import { Request, Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

import { httpStatusOptions, HttpStatusOptions, NestLogger, ResponseEntity } from '../common';
import { getIpByRequest } from '../ip';

@Catch()
export class RequestError implements ExceptionFilter {

  constructor(
    readonly logger: NestLogger,
    readonly options: HttpStatusOptions = httpStatusOptions,
  ) {}

  /**
   * error log
   * @param response
   * @param request
   * @param requestId
   */
  log(errorResponse: ResponseEntity<null>, request: Request, requestId: string) {
    const { originalUrl, body, query, method, headers } = request;
    const ip = getIpByRequest(request);

    let info = `[Error] [${method}] ${originalUrl} \n`;

    info += `[Request] [ID] ${requestId} \n`;
    info += `[Request] [Code] ${errorResponse.code}]`;
    info += `[Request] [Query] ${JSON.stringify(query)} \n`;
    info += `[Request] [Body] ${JSON.stringify(body)} \n`;
    info += `[Request] [Headers] ${JSON.stringify(headers)} \n`;
    info += `[Response] [Detail] ${JSON.stringify(errorResponse)} \n`;

    if (request['user']) info += `[Request] [User] ${JSON.stringify(request['user'])}`;

    this.logger.error(info, ip);
  }

  /**
   * error catch
   *
   * @param exception HttpException
   * @param host ArgumentsHost
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    const requestId = (request.headers['x-request-id'] as string);
    const code = exception instanceof HttpException ? exception.getStatus() : 400;
    const status = this.options.status.get(code);

    const errorResponse = {
      requestId,
      data: null,
      code: status.code,
      errorCode: status.errorCode,
      message: exception.message || status[this.options.language],
      timestamp: Date.now(),
    };

    this.log(errorResponse, request, requestId);

    response.status(200);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
