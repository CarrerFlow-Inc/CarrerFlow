import { Test, TestingModule } from '@nestjs/testing';
import { LembretesService } from './lembretes.service';

describe('LembretesService', () => {
  let service: LembretesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LembretesService],
    }).compile();

    service = module.get<LembretesService>(LembretesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
