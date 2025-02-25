import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockSeedsService } from './seeds/mock-seeds.service';

const mockMockSeedsService = {
  createMockData: jest.fn(),
};

const mockAppService = {
  getHello: jest.fn(() => 'Hello World!'),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: MockSeedsService, useValue: mockMockSeedsService },
        { provide: AppService, useValue: mockAppService },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  it('should return "Hello World!"', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });

  it('should call createMockData on MockSeedsService', async () => {
    await appController.createMockData();
    expect(mockMockSeedsService.createMockData).toHaveBeenCalled();
  });
});
