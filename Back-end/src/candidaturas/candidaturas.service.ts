import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { FilterCandidaturaDto } from './dto/filter-candidatura.dto';
import { Candidatura } from './entities/candidatura.entity';

@Injectable()
export class CandidaturasService {
  constructor(
    @InjectRepository(Candidatura)
    private candidaturasRepository: Repository<Candidatura>,
  ) {}

  //Cria nova candidatura
  async create(createCandidaturaDto: CreateCandidaturaDto): Promise<Candidatura> {
    const candidatura = this.candidaturasRepository.create({
      ...createCandidaturaDto,
      // status: createCandidaturaDto.status || StatusCandidatura.APLICADA,
    });
    return await this.candidaturasRepository.save(candidatura);
  }

  //Listar todas as candidaturas com filtros opcionais
  async findAll(filterDto: FilterCandidaturaDto): Promise<Candidatura[]> {
    const { search, sortBy = 'createdAt', orderBy = 'DESC' } = filterDto;

    const query = this.candidaturasRepository
      .createQueryBuilder('candidatura');

    //Filtro por status
    if (status) {
      query.andWhere('candidatura.status = :status', { status });
    }

    //Busca por empresa ou vaga
    if(search) {
      query.andWhere(
        '(candidatura.nomeEmpresa ILIKE :search OR candidatura.nomeVaga ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    //Ordenação
    query.orderBy(`candidatura.${sortBy}`, orderBy);
    return await query.getMany();
  }

  //Buscar candidatura por ID
  async findOne(id: string): Promise<Candidatura> {
    const candidatura = await this.candidaturasRepository.findOne({
      where: { id },
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
  ): Promise<Candidatura> {
    const candidatura = await this.findOne(id);

    Object.assign(candidatura, UpdateCandidaturaDto);

    return await this.candidaturasRepository.save(candidatura);
  }

  //Remover uma candidatura
  async remove(id: string): Promise<void> {
    const candidatura = await this.findOne(id);
    await this.candidaturasRepository.remove(candidatura);
  }
}
