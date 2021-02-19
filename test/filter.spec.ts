import axios from 'axios';
import { NestFactory } from '@nestjs/core';
import { expect, test } from '@jest/globals';
import { IsNotEmpty, IsString } from 'class-validator';
import { Get, HttpCode, HttpStatus, Req, Query, Module, Controller, BadRequestException } from '@nestjs/common';

import { GetPage, Pipe, Filter, NestLogger } from '../src';

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
  async error(@Req() req) {
    req.user = { name: 'mock' };
    throw new BadRequestException();
  }

  @Get('newError')
  @HttpCode(HttpStatus.OK)
  async newError() {
    throw new Error();
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

  const app = await NestFactory.create(CoreModule, { logger: false });
  app.useGlobalFilters(new Filter.CatchError(logger));
  app.useGlobalPipes(new Pipe.ValidateDto());
  await app.listen(3001);

  try {
    const response = await axios('http://localhost:3001/dto');
    expect(response.status === 422).toBe(true);
  } catch (error) {
    expect(!!error).toBe(true);
  }

  try {
    const response = await axios('http://localhost:3001/try');
    expect(response.status === 400).toBe(true);
  } catch (error) {
    expect(!!error).toBe(true);
  }

  try {
    const response = await axios('http://localhost:3001/error');
    expect(response.status === 500).toBe(true);
  } catch (error) {
    expect(!!error).toBe(true);
  }

  const response = await axios('http://localhost:3001/dto?test=1');
  expect(response.data.test === '1').toBe(true);
  app.close();
});
