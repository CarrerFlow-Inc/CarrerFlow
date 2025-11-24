import { Test, TestingModule } from '@nestjs/testing';
import { LembretesController } from './lembretes.controller';
import { LembretesService } from './lembretes.service';

describe('LembretesController', () => {
  let controller: LembretesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LembretesController],
      providers: [LembretesService],
    }).compile();

    controller = module.get<LembretesController>(LembretesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
