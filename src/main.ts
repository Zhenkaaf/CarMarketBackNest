/* import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`*************************Server is running on port ${port}`);
  });
}
bootstrap(); */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();

    const port = process.env.PORT || 3000;

    await app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error(
      'Error********************* starting the Nest application:',
      error,
    );
  }
}

bootstrap();

/* CYCLIC_URL  https://weak-gray-tutu.cyclic.app
CYCLIC_DB   weak-gray-tutuCyclicDB

CYCLIC_BUCKET_NAME   cyclic-weak-gray-tutu-eu-north-1

CYCLIC_APP_ID  weak-gray-tutu */
