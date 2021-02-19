import { HttpStatusOptions } from './interface';

export const httpStatusOptions: HttpStatusOptions = {
  /**
   * default language
   */
  language: 'en',

  /**
   * default status
   */
  status: new Map([
    [
      200,
      {
        code: 0,
        errorCode: '',
        zh: '请求成功',
        en: 'Request Success',
      },
    ],
    [
      400,
      {
        code: 400,
        errorCode: 'R400',
        zh: '请求有误',
        en: 'BadRequest',
      },
    ],
    [
      401,
      {
        code: 401,
        errorCode: 'R401',
        zh: '拒绝访问',
        en: 'Request Forbidden',
      },
    ],
    [
      403,
      {
        code: 403,
        errorCode: 'R403',
        zh: '无权限访问',
        en: 'Request Unauthorized',
      },
    ],
    [
      404,
      {
        code: 404,
        errorCode: 'R404',
        zh: '未找到访问资源',
        en: 'Request NotFound',
      },
    ],
    [
      408,
      {
        code: 408,
        errorCode: 'R408',
        zh: '请求超时',
        en: 'Request Timeout',
      },
    ],
    [
      422,
      {
        code: 422,
        errorCode: 'R422',
        zh: '参数有误',
        en: 'Request Unprocessable',
      },
    ],
    [
      500,
      {
        code: 500,
        errorCode: 'R500',
        zh: '服务端异常',
        en: 'InternalServerError',
      },
    ],
    [
      501,
      {
        code: 501,
        errorCode: 'R501',
        zh: '服务端执行失败',
        en: 'Request NotImplemented',
      },
    ],
    [
      502,
      {
        code: 502,
        errorCode: 'R502',
        zh: '服务端网关访问异常',
        en: 'BadGateway',
      },
    ],
    [
      503,
      {
        code: 503,
        errorCode: 'R503',
        zh: '服务端更新中，暂不可用',
        en: 'ServiceUnavailable',
      },
    ],
  ]),
};

