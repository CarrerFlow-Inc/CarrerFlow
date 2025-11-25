import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Lembrete } from './entities/lembrete.entity';
import { CreateLembreteDto } from './dto/create-lembrete.dto';
import { UpdateLembreteDto } from './dto/update-lembrete.dto';
import { CandidaturasService } from '../candidaturas/candidaturas.service';

@Injectable()
export class LembretesService {
  constructor(
    @InjectRepository(Lembrete)
    private lembretesRepository: Repository<Lembrete>,
    private candidaturasService: CandidaturasService,
  ) {}

  async create(createLembreteDto: CreateLembreteDto, userId: number): Promise<Lembrete> {
    // Verificar se a candidatura pertence ao usuário
    await this.candidaturasService.findOne(createLembreteDto.candidaturaId, userId);

    const lembrete = this.lembretesRepository.create({
      ...createLembreteDto,
      userId,
    });
    const saved = await this.lembretesRepository.save(lembrete);
    return saved;
  }

  async findAll(userId: string, candidaturaId?: string): Promise<Lembrete[]> {
    const query = this.lembretesRepository
      .createQueryBuilder('lembrete')
      .where('lembrete.userId = :userId', { userId })
      .leftJoinAndSelect('lembrete.candidatura', 'candidatura')
      .orderBy('lembrete.lembreteDate', 'ASC');

    if (candidaturaId) {
      query.andWhere('lembrete.candidaturaId = :candidaturaId', { candidaturaId });
    }

    return query.getMany();
  }

  async findPending(userId: string): Promise<Lembrete[]> {
    const now = new Date();
    return this.lembretesRepository.find({
      where: {
        userId,
        dataLembrete: LessThanOrEqual(now),
        concluido: false,
      },
      relations: ['candidatura'],
      order: { dataLembrete: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Lembrete> {
    const lembrete = await this.lembretesRepository.findOne({
      where: { id },
      relations: ['candidatura'],
    });

    if (!lembrete) {
      throw new NotFoundException('Lembrete não encontrado');
    }

    if (lembrete.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este lembrete');
    }

    if (!lembrete.candidatura) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return lembrete;
  }

  async update(id: string, updateLembreteDto: UpdateLembreteDto, userId: string): Promise<Lembrete> {
    const lembrete = await this.findOne(id, userId);
    
    Object.assign(lembrete, updateLembreteDto);
    return this.lembretesRepository.save(lembrete);
  }

  async markAsCompleted(id: string, userId: string): Promise<Lembrete> {
    const lembrete = await this.findOne(id, userId);
    lembrete.concluido = true;
    return this.lembretesRepository.save(lembrete);
  }

  async remove(id: string, userId: string): Promise<void> {
    const lembrete = await this.findOne(id, userId);
    await this.lembretesRepository.remove(lembrete);
  }
}