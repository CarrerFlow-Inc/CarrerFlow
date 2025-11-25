import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidaturasModule } from '../candidaturas/candidaturas.module';
import { LembretesModule } from '../lembretes/lembretes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    CandidaturasModule,
    LembretesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
