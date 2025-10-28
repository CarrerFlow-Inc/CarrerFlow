import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { FilterCandidaturaDto } from './dto/filter-candidatura.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Candidatura } from './entities/candidatura.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('candidaturas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('candidaturas')
export class CandidaturasController {
  constructor(private readonly candidaturasService: CandidaturasService) {}

  //Criar nova candidatura
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar uma nova candidatura',
    description: 'Registra uma nova candidatura no sistema. O status inicial será "Aplicada".',
  })
  @ApiBody({ type: CreateCandidaturaDto })
  @ApiResponse({
    status: 201,
    description: 'Candidatura criada com sucesso.',
    type: Candidatura,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos.',
  })
  create(@Body() createCandidaturaDto: CreateCandidaturaDto) {
    return this.candidaturasService.create(createCandidaturaDto);
  }

  //Listar todas as candidaturas com filtros opcionais
  @Get()
  @ApiOperation({
    summary: 'Listar candidaturas',
    description: 'Retorna todas as candidaturas cadastradas. Suporta filtros por status, busca textual, ordenação e direção.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status da candidatura',
    enum: ['Aplicada', 'Entrevista RH', 'Entrevista Técnica', 'Entrevista Gestor', 'Oferta Recebida', 'Aceita', 'Rejeitada', 'Cancelada'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nome da empresa ou título da vaga',
    example: 'Tech',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenação',
    enum: ['applicationDate', 'companyName', 'createdAt'],
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Direção da ordenação',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de candidaturas retornada com sucesso',
    type: [Candidatura],
  })
  findAll(@Query() filterDto: FilterCandidaturaDto) {
    return this.candidaturasService.findAll(filterDto);
  }

  //Retorna detalhes de uma candidatura pelo ID
  @Get(':id')
  @ApiOperation({
    summary: 'Obter detalhes da candidatura',
    description: 'Retorna todas as informações de uma candidatura específica pelo ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da candidatura (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Candidatura encontrada',
    type: Candidatura,
  })
  @ApiResponse({
    status: 404,
    description: 'Candidatura não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.candidaturasService.findOne(id);
  }

  //Atualiza uma candidatura existente
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar candidatura',
    description: 'Atualiza informações de uma candidatura existente. Apenas os campos fornecidos serão atualizados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da candidatura (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCandidaturaDto })
  @ApiResponse({
    status: 200,
    description: 'Candidatura atualizada com sucesso',
    type: Candidatura,
  })
  @ApiResponse({
    status: 404,
    description: 'Candidatura não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  update(
    @Param('id') id: string,
    @Body() updateCandidaturaDto: UpdateCandidaturaDto
  ) {
    return this.candidaturasService.update(id, updateCandidaturaDto);
  }

  //Remove uma candidatura
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Excluir candidatura',
    description: 'Remove permanentemente uma candidatura do sistema.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da candidatura (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Candidatura excluída com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Candidatura não encontrada',
  })
  async remove(@Param('id') id: string) {
    await this.candidaturasService.remove(id);
  }
}
