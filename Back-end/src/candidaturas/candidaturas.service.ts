import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { FilterCandidaturaDto } from './dto/filter-candidatura.dto';
import { Candidatura, StatusCandidatura } from './entities/candidatura.entity';

@Injectable()
export class CandidaturasService {
  constructor(
    @InjectRepository(Candidatura)
    private candidaturasRepository: Repository<Candidatura>,
  ) {}

  //Cria nova candidatura
  async create(
    createCandidaturaDto: CreateCandidaturaDto,
    userId: number,
  ): Promise<Candidatura> {
    const candidatura = this.candidaturasRepository.create({
      ...createCandidaturaDto,
      userId,
      status: createCandidaturaDto.status || StatusCandidatura.APLICADA,
    });
    return await this.candidaturasRepository.save(candidatura);
  }

  //Listar todas as candidaturas com filtros opcionais
  async findAll(
    filterDto: FilterCandidaturaDto,
    userId: number,
  ): Promise<Candidatura[]> {
    const {
      status,
      search,
      sortBy = 'createdAt',
      orderBy = 'DESC',
    } = filterDto;

    const queryBuider = this.candidaturasRepository
      .createQueryBuilder('candidatura')
      .where('candidatura.userId = :userId', { userId });

    //Busca por status
    if (status) {
      queryBuider.andWhere('candidatura.status = :status', { status });
    }

    //Busca por vaga
    if (search) {
      queryBuider.andWhere(
        '(candidatura.nomeEmpresa ILIKE :search OR candidatura.tituloVaga ILIKE :search)',
        { search: `%${search}` },
      );
    }

    //Ordenação
    queryBuider.orderBy(
      `candidatura.${sortBy}`,
      orderBy.toUpperCase() as 'ASC' | 'DESC',
    );

    return await queryBuider.getMany();
  }

  //Buscar candidatura por ID
  async findOne(id: string, userId: number): Promise<Candidatura> {
    const candidatura = await this.candidaturasRepository.findOne({
      where: { id, userId },
    });

    if (!candidatura) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return candidatura;
  }

  //Atualiza uma candidatura existente
  async update(
    id: string,
    UpdateCandidaturaDto: UpdateCandidaturaDto,
    userId: number,
  ): Promise<Candidatura> {
    const candidatura = await this.findOne(id, userId);

    Object.assign(candidatura, UpdateCandidaturaDto);

    return await this.candidaturasRepository.save(candidatura);
  }

  //Remover uma candidatura
  async remove(id: string, userId: number): Promise<void> {
    const candidatura = await this.findOne(id, userId);
    await this.candidaturasRepository.remove(candidatura);
  }
}
