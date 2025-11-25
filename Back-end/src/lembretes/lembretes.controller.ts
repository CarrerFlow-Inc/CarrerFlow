import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LembretesService } from './lembretes.service';
import { CreateLembreteDto } from './dto/create-lembrete.dto';
import { UpdateLembreteDto } from './dto/update-lembrete.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('lembretes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lembretes')
export class LembretesController {
  constructor(private readonly lembretesService: LembretesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo lembrete' })
  @ApiResponse({ status: 201, description: 'Lembrete criado com sucesso' })
  create(@Body() createLembreteDto: CreateLembreteDto, @Request() req) {
    return this.lembretesService.create(createLembreteDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os lembretes do usuário' })
  @ApiQuery({ name: 'applicationId', required: false, description: 'Filtrar por candidatura específica' })
  @ApiResponse({ status: 200, description: 'Lista de lembretes' })
  findAll(@Request() req, @Query('applicationId') applicationId?: string) {
    return this.lembretesService.findAll(req.user.id, applicationId);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Listar lembretes pendentes (vencidos ou próximos do vencimento)' })
  @ApiResponse({ status: 200, description: 'Lista de lembretes pendentes' })
  findPending(@Request() req) {
    return this.lembretesService.findPending(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter lembrete específico' })
  @ApiResponse({ status: 200, description: 'Detalhes do lembrete' })
  @ApiResponse({ status: 404, description: 'Lembrete não encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.lembretesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar lembrete' })
  @ApiResponse({ status: 200, description: 'Lembrete atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateLembreteDto: UpdateLembreteDto, @Request() req) {
    return this.lembretesService.update(id, updateLembreteDto, req.user.id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Marcar lembrete como concluído' })
  @ApiResponse({ status: 200, description: 'Lembrete marcado como concluído' })
  markAsCompleted(@Param('id') id: string, @Request() req) {
    return this.lembretesService.markAsCompleted(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir lembrete' })
  @ApiResponse({ status: 200, description: 'Lembrete excluído com sucesso' })
  remove(@Param('id') id: string, @Request() req) {
    return this.lembretesService.remove(id, req.user.id);
  }
}