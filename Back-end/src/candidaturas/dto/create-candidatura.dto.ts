import { IsEnum, IsOptional, IsString } from "class-validator";
// import { StatusCandidatura } from "../entities/candidatura.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCandidaturaDto {
    @ApiProperty({
    description: 'Nome da empresa',
    example: 'Tech Solutions',
    minLength: 2,
    maxLength: 100,
    })
    @IsString()
    nomeEmpresa!: string;

    @ApiProperty({
    description: 'Título da vaga',
    example: 'Desenvolvedor Full Stack Júnior',
    minLength: 2,
    maxLength: 150,
    })
    @IsString()
    tituloVaga!: string;

    @ApiProperty({
    description: 'Data de aplicação da candidatura',
    example: '2025-10-15',
    type: String,
    format: 'date',
    })
    @IsString()
    dataCandidatura!: Date;

    @ApiPropertyOptional({
    description: 'Anotações sobre a candidatura',
    example: 'Vaga interessante com foco em React e Node.js. Entrevista marcada para 20/10.',
    })
    @IsString()
    @IsOptional()
    observacoes?: string;

    // @ApiPropertyOptional({
    // description: 'Status atual da candidatura',
    // enum: StatusCandidatura,
    // default: StatusCandidatura.APLICADA,
    // example: StatusCandidatura.APLICADA,
    // })
    // @IsEnum(StatusCandidatura)
    // @IsOptional()
    // status?: StatusCandidatura;
}
