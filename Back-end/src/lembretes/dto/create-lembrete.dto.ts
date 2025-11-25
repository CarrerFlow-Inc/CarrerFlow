import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLembreteDto {
    @ApiProperty({ description: 'Título do lembrete' })
    @IsString()
    titulo!: string;

    @ApiProperty({ description: 'Descrição do lembrete', required: false})
    @IsOptional()
    @IsString()
    descricao?: string;

    @ApiProperty({ description: 'Data e hora do lembrete' })
    @IsDateString()
    dataLembrete!: Date;

    @ApiProperty({ description: 'ID da candidatura associada' })
    @IsUUID()
    candidaturaId!: string;
}
