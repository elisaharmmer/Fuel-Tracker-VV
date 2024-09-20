import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitando CORS
  app.enableCors({
    origin: '*', // Permite todas as origens - modifique para restringir conforme necessário
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(process.env.APP_PORT || 3000);
}

bootstrap()
    .then(() => console.log('Success Bootstrap App'))
    .catch((error) => console.log('Error Bootstrap App', error));
