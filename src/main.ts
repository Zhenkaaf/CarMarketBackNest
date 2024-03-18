import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    // Добавляем middleware для обработки OPTIONS запросов
    app.use((req, res, next) => {
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

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
