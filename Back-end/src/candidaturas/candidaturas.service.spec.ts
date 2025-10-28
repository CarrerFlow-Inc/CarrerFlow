import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service';
import { Candidatura, StatusCandidatura } from './entities/candidatura.entity';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { FilterCandidaturaDto } from './dto/filter-candidatura.dto';

describe('ApplicationsService', () => {
  let service: CandidaturasService;
  let repository: Repository<Candidatura>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidaturasService,
        {
          provide: getRepositoryToken(Candidatura),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CandidaturasService>(CandidaturasService);
    repository = module.get<Repository<Candidatura>>(getRepositoryToken(Candidatura));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new application', async () => {
      const createApplicationDto: CreateCandidaturaDto = {
        nomeEmpresa: 'Test Company',
        tituloVaga: 'Software Developer',
        dataCandidatura: new Date ('2023-01-01'),
      };

      const candidatura = {
        id: '1',
        ...createApplicationDto,
        status: StatusCandidatura.APLICADA,
        userId: '1',
      };

      mockRepository.create.mockReturnValue(candidatura);
      mockRepository.save.mockResolvedValue(candidatura);

      const result = await service.create(createApplicationDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createApplicationDto,
        status: StatusCandidatura.APLICADA,
      });
      expect(repository.save).toHaveBeenCalledWith(candidatura);
      expect(result).toEqual(candidatura);
    });
  });

  describe('findAll', () => {
    it('should return all applications for user', async () => {
      const candidatura = [
        {
          id: '1',
          nomeEmpresa: 'Test Company',
          tituloVaga: 'Software Developer',
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(candidatura);

      const result = await service.findAll({});

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('candidatura');
      expect(result).toEqual(candidatura);
    });

    it('should filter applications by status', async () => {
      const filterDto: FilterCandidaturaDto = {
        status: StatusCandidatura.APLICADA,
      };

      const candidatura = [
        {
          id: '1',
          nomeEmpresa: 'Test Company',
          status: StatusCandidatura.APLICADA,
          userId: '1',
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(candidatura);

  const result = await service.findAll(filterDto);

  expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('candidatura.status = :status', { status: StatusCandidatura.APLICADA });
  expect(result).toEqual(candidatura);
    });
  });

  describe('findOne', () => {
    it('should return an application by id', async () => {
      const candidatura = {
        id: '1',
        nomeEmpresa: 'Test Company',
        userId: '1',
      };

      mockRepository.findOne.mockResolvedValue(candidatura);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(candidatura);
    });

    it('should throw NotFoundException if application not found', async () => {
  mockRepository.findOne.mockResolvedValue(null);

  await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    // Authorization is not handled in service.findOne; skip ForbiddenException test
  });

  describe('update', () => {
    it('should update an application', async () => {
      const updateCandidaturaDto: UpdateCandidaturaDto = {
        status: StatusCandidatura.ENTREVISTA_RH,
      };

      const candidatura = {
        id: '1',
        nomeEmpresa: 'Test Company',
        userId: '1',
        status: StatusCandidatura.APLICADA,
      };

      const updatedCandidatura = {
        ...candidatura,
        status: StatusCandidatura.ENTREVISTA_RH,
      };

  jest.spyOn(service, 'findOne').mockResolvedValue(candidatura as any);
  mockRepository.save.mockResolvedValue(updatedCandidatura);

  const result = await service.update('1', updateCandidaturaDto);

  expect(service.findOne).toHaveBeenCalledWith('1');
  expect(repository.save).toHaveBeenCalled();
  expect(result).toEqual(updatedCandidatura);
    });
  });

  describe('remove', () => {
    it('should remove an application', async () => {
      const candidatura = {
        id: '1',
        nomeEmpresa: 'Test Company',
        userId: '1',
      };

  jest.spyOn(service, 'findOne').mockResolvedValue(candidatura as any);
  mockRepository.remove.mockResolvedValue(candidatura);

  await service.remove('1');

  expect(service.findOne).toHaveBeenCalledWith('1');
  expect(repository.remove).toHaveBeenCalledWith(candidatura);
    });
  });

  // getStatusCounts was removed from the service; no tests for it
});