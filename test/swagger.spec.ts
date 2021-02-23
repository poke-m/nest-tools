import { test } from '@jest/globals';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { HealthModule, Swagger } from '../src';

test('Swagger.create', async () => {
  @Module({ imports: [HealthModule] })
  class CoreModule {}
  const app = await NestFactory.create(CoreModule);
  Swagger.create(app);
  await app.listen(7001);
  await app.close();
});
