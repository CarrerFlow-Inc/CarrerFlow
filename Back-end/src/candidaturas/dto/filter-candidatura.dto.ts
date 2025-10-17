import { IsEnum, IsOptional, IsString } from "class-validator";
// import { StatusCandidatura } from "../entities/candidatura.entity";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterCandidaturaDto {
    // @ApiPropertyOptional({
    // description: 'Filtrar candidaturas por status',
    // enum: StatusCandidatura,
    // example: StatusCandidatura.APLICADA,
    // })
    // @IsEnum(StatusCandidatura)
    // @IsOptional()
    // status?: StatusCandidatura;

    @ApiPropertyOptional({
    description: 'Buscar por nome da empresa ou título da vaga',
    example: 'Tech',
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional({
    description: 'Campo para ordenação',
    enum: ['applicationDate', 'companyName', 'createdAt'],
    default: 'createdAt',
    example: 'applicationDate',
    })
    @IsString()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional({
    description: 'Ordem de classificação',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
    })
    @IsString()
    @IsOptional()
    orderBy?: 'ASC' | 'DESC';
}