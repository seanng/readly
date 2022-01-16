import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';

const config = {
  cors: true,
};

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, config);
  await app.listen(3002);
}
bootstrap();
