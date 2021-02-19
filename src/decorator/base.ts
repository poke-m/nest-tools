import { Request } from 'express';
import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';

import { getIpByRequest } from '../ip';

/**
 * catch error
 *
 * @param message error message
 * @param message error code
 */
export const CatchError = (message: string, code: number) => {
  return (target: any, methodName: string, desc: PropertyDescriptor) => {
    desc.value = async function(...args: any[]) {
      try {
        const method = target[methodName].bind(this);
        const result = await method(...args);
        return result;
      } catch (error) {
        throw new HttpException(message, code);
      }
    };
  };
};

/**
 * get user from request
 */
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request['user'];
  },
);

/**
 * get ip from request
 */
export const GetIP = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return getIpByRequest(request);
  },
);

/**
 * get query pagination from request
 */
export const GetPage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const pagination = {
      page: 1,
      pageSize: 10,
      order: 'id DESC',
    };

    if (request.query && request.query.pagination) {
      try {
        const { page, pageSize, order } = JSON.parse(request.query.pagination as string);
        if (page) pagination.page = page;
        if (order) pagination.order = order;
        if (pageSize) pagination.pageSize = pageSize;
      } catch (error) {
        console.log('GetPage Error: request.query.pagination' + error);
      }
    }

    return pagination;
  },
);
