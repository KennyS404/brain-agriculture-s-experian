import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { MockSeedsService } from './src/seeds/mock-seeds.service';


async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mockSeedsService = app.get(MockSeedsService);

  await mockSeedsService.createMockData();

  await app.close();
}

bootstrap();
