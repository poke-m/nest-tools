import axios from 'axios';
import { NestFactory } from '@nestjs/core';
import { expect, test } from '@jest/globals';
import { IsNotEmpty, IsString } from 'class-validator';
import { Get, HttpCode, HttpStatus, Req, Query, Module, Controller, BadRequestException } from '@nestjs/common';

import { GetPage, Pipe, Filter, NestLogger, CatchError } from '../src';

class DemoDto {
  @IsString()
  @IsNotEmpty({ message: 'test' })
  test?: string;
}

@Controller()
class DemoController {

  @Get('dto')
  @HttpCode(HttpStatus.OK)
  async dto(@Req() req, @Query() args: DemoDto, @GetPage() page) {
    req.page = page;
    req.headers['content-type'] = 'application/x-www-form-urlencoded';
    return args;
  }

  @Get('error')
  @HttpCode(HttpStatus.OK)
  @CatchError('test', 500)
  async error(@Req() req) {
    req.user = { name: 'mock' };
    throw new BadRequestException();
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  @CatchError('test', 500)
  async test() {
    throw new Error();
  }

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @CatchError('info', 500)
  async info() {
    return 1;
  }

  @Get('try')
  @HttpCode(HttpStatus.OK)
  async try() {
    throw new Error();
  }
}

@Module({
  controllers: [
    DemoController,
  ],
})
class CoreModule {}

test('Filter.CatchError', async () => {
  const logger = new NestLogger();

  logger.debug('debug');
  logger.warn('warn');
  logger.log('log');

  const app = await NestFactory.create(CoreModule, { logger: false });
  app.useGlobalFilters(new Filter.RequestError(logger));
  app.useGlobalPipes(new Pipe.ValidateDto());
  await app.listen(3001);

  const response = await axios('http://localhost:3001/dto?test=1');
  expect(response.data.test === '1').toBe(true);

  try {
    const response = await axios('http://localhost:3001/dto');
    expect(response.status === 200).toBe(true);
    expect(response.data.code === 422).toBe(true);
  } catch (error) {
    throw new Error(error);
  }

  try {
    const response = await axios('http://localhost:3001/test');
    expect(response.status === 200).toBe(true);
    expect(response.data.code === 500).toBe(true);
  } catch (error) {
    throw new Error(error);
  }

  try {
    const response = await axios('http://localhost:3001/try');
    expect(response.status === 200).toBe(true);
    expect(response.data.code === 400).toBe(true);
  } catch (error) {
    throw new Error(error);
  }

  try {
    const response = await axios('http://localhost:3001/error');
    expect(response.status === 200).toBe(true);
    expect(response.data.code === 500).toBe(true);
  } catch (error) {
    throw new Error(error);
  }

  try {
    const response = await axios('http://localhost:3001/info');
    expect(response.status === 200).toBe(true);
    expect(response.data === 1).toBe(true);
  } catch (error) {
    throw new Error(error);
  }

  app.close();
});
