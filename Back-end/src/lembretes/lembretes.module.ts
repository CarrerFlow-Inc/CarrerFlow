import { Module } from '@nestjs/common';
import { LembretesService } from './lembretes.service';
import { LembretesController } from './lembretes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lembrete } from './entities/lembrete.entity';
import { Candidatura } from '../candidaturas/entities/candidatura.entity';
import { CandidaturasModule } from '../candidaturas/candidaturas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lembrete]),
    CandidaturasModule,
  ],
  controllers: [LembretesController],
  providers: [LembretesService],
  exports: [LembretesService],
})
export class LembretesModule {}
