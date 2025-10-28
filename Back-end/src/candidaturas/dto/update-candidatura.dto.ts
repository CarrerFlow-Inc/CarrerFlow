import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidaturaDto } from './create-candidatura.dto';
import { StatusCandidatura } from '../entities/candidatura.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCandidaturaDto extends PartialType(CreateCandidaturaDto) {
  @ApiPropertyOptional({
    description: 'Nome da empresa',
    example: 'Tech Solutions',
  })
  @IsString()
  @IsOptional()
  nomeEmpresa?: string;

  @ApiPropertyOptional({
    description: 'Título da vaga',
    example: 'Desenvolvedor Full Stack Júnior',
  })
  @IsString()
  @IsOptional()
  tituloVaga?: string;

  @ApiPropertyOptional({
    description: 'Data de aplicação da candidatura',
    example: '2025-10-15',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsString()
  dataCandidatura?: Date;

  @ApiPropertyOptional({
    description: 'Anotações sobre a candidatura',
    example: 'Primeira entrevista realizada. Aguardando retorno.',
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: 'Status atual da candidatura',
    enum: StatusCandidatura,
    example: StatusCandidatura.ENTREVISTA_RH,
  })
  @IsOptional()
  @IsEnum(StatusCandidatura)
  status?: StatusCandidatura;
}
