import { Test, TestingModule } from '@nestjs/testing';
import { CandidaturasController } from './candidaturas.controller';
import { CandidaturasService } from './candidaturas.service';

describe('CandidaturasController', () => {
  let controller: CandidaturasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidaturasController],
      providers: [CandidaturasService],
    }).compile();

    controller = module.get<CandidaturasController>(CandidaturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
