import { Test, TestingModule } from '@nestjs/testing';
import { CandidaturasController } from './candidaturas.controller';
import { CandidaturasService } from './candidaturas.service';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { FilterCandidaturaDto } from './dto/filter-candidatura.dto';
import { StatusCandidatura } from './entities/candidatura.entity';
import { mock } from 'node:test';

describe('CandidaturasController', () => {
  let controller: CandidaturasController;
  let candidaturasService: CandidaturasService;

  const mockApplicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStatusCounts: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidaturasController],
      providers: [
        {
          provide: CandidaturasService,
          useValue: mockApplicationsService,
        },
      ],
    }).compile();

    controller = module.get<CandidaturasController>(CandidaturasController);
    candidaturasService = module.get<CandidaturasService>(CandidaturasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new application', async () => {
      const createdCandidaturaDto: CreateCandidaturaDto = {
        nomeEmpresa: 'Test Company',
        tituloVaga: 'Software Developer',
        dataCandidatura: new Date('2023-01-01'),
      };

      const createdCandidaturas = {
        id: '1',
        ...createdCandidaturaDto,
        status: StatusCandidatura.APLICADA,
        userId: '1',
      };

      mockApplicationsService.create.mockResolvedValue(createdCandidaturas);

      const result = await controller.create(createdCandidaturaDto);

      expect(candidaturasService.create).toHaveBeenCalledWith(
        createdCandidaturaDto,
        '1',
      );
      expect(result).toEqual(createdCandidaturas);
    });
  });

  describe('findAll', () => {
    it('should return all applications for user', async () => {
      const filterDto: FilterCandidaturaDto = {
        status: StatusCandidatura.APLICADA,
      };

      const candidaturas = [
        {
          id: '1',
          nomeEmpresa: 'Test Company',
          tituloVaga: 'Software Developer',
          status: StatusCandidatura.APLICADA,
          userId: '1',
        },
      ];

      mockApplicationsService.findAll.mockResolvedValue(candidaturas);

      const result = await controller.findAll(mockRequest, filterDto);

      expect(candidaturasService.findAll).toHaveBeenCalledWith('1', filterDto);
      expect(result).toEqual(candidaturas);
    });
  });

  describe('findOne', () => {
    it('should return a specific application', async () => {
      const application = {
        id: '1',
        nomeEmpresa: 'Test Company',
        tituloVaga: 'Software Developer',
        userId: '1',
      };

      mockApplicationsService.findOne.mockResolvedValue(application);

      const result = await controller.findOne('1');

      expect(candidaturasService.findOne).toHaveBeenCalledWith('1', '1');
      expect(result).toEqual(application);
    });
  });

  describe('update', () => {
    it('should update an application', async () => {
      const updateCandidaturaDto: UpdateCandidaturaDto = {
        status: StatusCandidatura.ENTREVISTA_RH,
      };

      const updateApplication = {
        id: '1',
        nomeEmpresa: 'Test Company',
        tituloVaga: 'Software Developer',
        status: StatusCandidatura.ENTREVISTA_RH,
        userId: '1',
      };

      mockApplicationsService.update.mockResolvedValue(updateApplication);

      const result = await controller.update('1', updateCandidaturaDto);

      expect(candidaturasService.update).toHaveBeenCalledWith(
        '1',
        updateCandidaturaDto,
      );
      expect(result).toEqual(updateApplication);
    });
  });

  describe('remove', () => {
    it('should remove an application', async () => {
      mockApplicationsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(candidaturasService.remove).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });
  });
});
