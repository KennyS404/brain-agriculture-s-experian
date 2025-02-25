import { Controller, Get } from '@nestjs/common';
import { MockSeedsService } from './seeds/mock-seeds.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly mockSeedsService: MockSeedsService,
    private readonly appService: AppService,
  ) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('seeds/mock')
  async createMockData() {
    return this.mockSeedsService.createMockData();
  }
}
