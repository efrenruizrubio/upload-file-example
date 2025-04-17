import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ exposedHeaders: ['*'] });

  const config = new DocumentBuilder()
    .setTitle('Upload File Example API')
    .setDescription(
      'This is an API to upload files, and retrieve them using attachment and inline methods',
    )
    .setVersion('1.0')
    .addTag('upload')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
