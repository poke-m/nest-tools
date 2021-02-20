import axios from 'axios';
import { NestFactory } from '@nestjs/core';
import { expect, test } from '@jest/globals';
import { Get, HttpCode, HttpStatus, Req, Module, Controller } from '@nestjs/common';

import { GetIP, GetPage, GetUser, Interceptor, NestLogger } from '../src';

@Controller()
class DemoController {
  @Get('dto')
  @HttpCode(HttpStatus.OK)
  async dto(@Req() req, @GetPage() page) {
    req.page = page;
    req.headers['content-type'] = 'application/x-www-form-urlencoded';
    return 'dto';
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  async user(@Req() req) {
    req.user = { name: 'mock' };
    return req.user;
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async test(@Req() req, @GetIP() ip, @GetPage() page, @GetUser() user) {
    req.user = { ip, page };
    return user;
  }

  @Get('xml')
  @HttpCode(HttpStatus.OK)
  async xml(@Req() req) {
    req.headers['content-type'] = 'application/xml';
    return 'xml';
  }

  @Get('data')
  @HttpCode(HttpStatus.OK)
  async data() {
    return { data: 1, code: 1, errorCode: 1, message: 1, timestamp: 1 };
  }
}

@Module({
  controllers: [
    DemoController,
  ],
})
class CoreModule {}

test('Interceptor', async () => {
  const logger = new NestLogger();

  logger.info('info');
  logger.error('info');

  const app = await NestFactory.create(CoreModule, { logger: false });
  app.useGlobalInterceptors(new Interceptor.RequestId(logger));
  app.useGlobalInterceptors(new Interceptor.RequestLog(logger));
  app.useGlobalInterceptors(new Interceptor.RequestFormat());
  await app.listen(3002);

  const response1 = await axios('http://localhost:3002/dto');
  expect(response1.data.data === 'dto').toBe(true);

  const response2 = await axios('http://localhost:3002/user');
  expect(response2.data.data.name === 'mock').toBe(true);

  const response3 = await axios('http://localhost:3002/data');
  expect(response3.data.code === 1).toBe(true);
  expect(response3.data.data === 1).toBe(true);

  const response4 = await axios('http://localhost:3002/xml');
  expect(response4.data === 'xml').toBe(true);

  const pagination = {
    page: 1,
    pageSize: 10,
    order: 'id DESC',
  };

  await axios('http://localhost:3002/test?pagination=' + JSON.stringify(pagination));

  await axios('http://localhost:3002/test?pagination=1');
  app.close();
});
