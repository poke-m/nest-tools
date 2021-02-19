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
}

@Module({
  controllers: [
    DemoController,
  ],
})
class CoreModule {}

test('Interceptor', async () => {
  const logger = new NestLogger();

  const app = await NestFactory.create(CoreModule, { logger: false });
  app.useGlobalInterceptors(new Interceptor.RequestId(logger));
  app.useGlobalInterceptors(new Interceptor.RequestLog(logger));
  app.useGlobalInterceptors(new Interceptor.RequestFormat());
  await app.listen(3002);

  const response1 = await axios('http://localhost:3002/dto');
  expect(response1.data.data === 'dto').toBe(true);

  const response2 = await axios('http://localhost:3002/user');
  expect(response2.data.data.name === 'mock').toBe(true);

  await axios('http://localhost:3002/test?pagination=');

  app.close();
});
