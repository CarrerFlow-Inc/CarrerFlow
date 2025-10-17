import { Module } from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service';
import { CandidaturasController } from './candidaturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidatura } from './entities/candidatura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidatura])],
  controllers: [CandidaturasController],
  providers: [CandidaturasService],
})

export class CandidaturasModule {}
