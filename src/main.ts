import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // Transforma los datos entrantes a los tipos definidos en los DTOs
    transformOptions: {
      enableImplicitConversion: true, // Permite la conversión implícita de tipos
    },
  }));

  //! Configurar el prefijo global para las rutas de la API ejemplo: /api/v2
  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
