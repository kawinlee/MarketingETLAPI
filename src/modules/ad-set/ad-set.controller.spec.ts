import { Test, TestingModule } from '@nestjs/testing';
import { AdSetController } from './ad-set.controller';
import { AdSetService } from './ad-set.service';


describe('AppController', () => {
  let adSetController: AdSetController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AdSetController],
      providers: [AdSetService],
    }).compile();

    adSetController = app.get<AdSetController>(AdSetController);
  });

  describe('root', () => {});
});
