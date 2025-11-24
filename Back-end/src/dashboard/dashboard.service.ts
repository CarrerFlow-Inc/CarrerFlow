import { Injectable } from '@nestjs/common';
import { CandidaturasService } from '../candidaturas/candidaturas.service';
import { LembretesService } from '../lembretes/lembretes.service';

@Injectable()
export class DashboardService {
  constructor(
    private candidaturasService: CandidaturasService,
    private lembretesService: LembretesService,
  ) {}

  async getDashboardData(userId: string) {
    const [
      statusCounts,
      totalCandidaturas,
      lembretesPendentes,
    ] = await Promise.all([
      this.candidaturasService.getStatusCounts(userId),
      this.candidaturasService.findAll({ orderBy: 'DESC' }, Number(userId)),
      this.lembretesService.findPending(userId),
    ]);

    // Pegar apenas as 5 candidaturas mais recentes
    const candidaturasRecentesLimited = totalCandidaturas.slice(0, 5);

    // Calcular estatísticas adicionais
    const totalCount = totalCandidaturas.length;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisMonthApplications = totalCandidaturas.filter(
      app => new Date(app.createdAt!) >= thisMonth
    ).length;

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthCandidaturas = totalCandidaturas.filter(
      app => {
        const appDate = new Date(app.createdAt!);
        return appDate >= lastMonth && appDate < thisMonth;
      }
    ).length;

    const monthlyGrowth = lastMonthCandidaturas > 0
      ? ((thisMonthApplications - lastMonthCandidaturas) / lastMonthCandidaturas) * 100
      : thisMonthApplications > 0 ? 100 : 0;

    return {
      statusCounts,
      candidaturasRecentes: candidaturasRecentesLimited,
      lembretesPendentes: lembretesPendentes.slice(0, 5), // Limitar a 5 lembretes
      statistics: {
        totalCandidaturas: totalCount,
        thisMonthCandidaturas: thisMonthApplications,
        lastMonthCandidaturas,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
        pendingRemindersCount: lembretesPendentes.length,
      }
    };
  }
}
