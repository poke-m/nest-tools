import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Create Swagger for the current server application
 */
export const create = (application: INestApplication, router = '/doc') => {
  SwaggerModule.setup(
    router,
    application,
    SwaggerModule.createDocument(
      application,
      new DocumentBuilder().setTitle('server').build(),
    ),
  );
};
