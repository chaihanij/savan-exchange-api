import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as NestJSLogger, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const logger = new NestJSLogger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // captures logs early
  });
  app.useLogger(app.get(Logger)); // use Pino logger
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Savan Exchange API')
    .setDescription('Savan Exchange Friend and Money Transfer API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .addTag('API')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

void (async (): Promise<void> => {
  try {
    await bootstrap();
  } catch (error) {
    NestJSLogger.error(error);
  }
})();