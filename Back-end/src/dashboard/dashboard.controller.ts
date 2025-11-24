import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Obter dados do dashboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do dashboard incluindo estatísticas, candidaturas recentes e lembretes pendentes' 
  })
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboardData(req.user.id);
  }
}