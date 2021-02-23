import axios from 'axios';
import { test, expect } from '@jest/globals';
import { NestFactory } from '@nestjs/core';
import { Controller, Get, HttpCode, HttpStatus, Module } from '@nestjs/common';
import { HealthModule, StoreModule, StoreProvider, Swagger } from '../src';

test('StoreModule', async () => {
  @Controller()
  class DemoController {
    constructor(private readonly store: StoreProvider<'name'>) {}

    @Get('test')
    @HttpCode(HttpStatus.OK)
    async test() {
      return this.store.get('name');
    }
  }

  @Module({ imports: [HealthModule, StoreModule], controllers: [DemoController] })
  class CoreModule {}

  const app = await NestFactory.create(CoreModule);
  const store: StoreProvider<'name'> = app.get(StoreProvider);
  store.save('name', 'test');

  Swagger.create(app);
  await app.listen(7002);

  const response = await axios('http://localhost:7002/test');
  expect(response.status).toBe(200);
  expect(response.data).toBe('test');

  await app.close();
});
