import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no permitidas
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
    transform: true, // Transforma los datos entrantes a sus tipos correspondientes
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
