import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './common/middleware/error.middleware';
import { configureValidationPipe } from './common/pipes/validation.pipe';
import { swaggerConfig } from 'swaggerConfig';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  console.log('Starting NestJS application on PORT:', PORT);
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(configureValidationPipe());
  app.useGlobalFilters(new ErrorFilter());

  await app.listen(PORT);
}
bootstrap();
