import { Test, TestingModule } from '@nestjs/testing';
import { CandidaturasService } from './candidaturas.service';

describe('CandidaturasService', () => {
  let service: CandidaturasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidaturasService],
    }).compile();

    service = module.get<CandidaturasService>(CandidaturasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
