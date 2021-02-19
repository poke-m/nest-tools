import axios from 'axios';
import { NestFactory } from '@nestjs/core';
import { expect, test } from '@jest/globals';
import { IsNotEmpty, IsString } from 'class-validator';
import { Get, HttpCode, HttpStatus, Req, Query, Module, Controller } from '@nestjs/common';

import { GetPage, Pipe } from '../src';

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
}

@Module({
  controllers: [
    DemoController,
  ],
})
class CoreModule {}

test('Pipe.ValidateDto', async () => {
  const app = await NestFactory.create(CoreModule, { logger: false });
  app.useGlobalPipes(new Pipe.ValidateDto());
  await app.listen(3000);

  try {
    await axios('http://localhost:3000/dto');
  } catch (error) {
    expect(!!error).toBe(true);
  }

  try {
    await axios('http://localhost:3000/dto?a=a');
  } catch (error) {
    expect(!!error).toBe(true);
  }

  const response = await axios('http://localhost:3000/dto?test=1');
  expect(response.data.test === '1').toBe(true);
  app.close();
});
