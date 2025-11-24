import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateLembreteDto } from './create-lembrete.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateLembreteDto extends PartialType(
    OmitType(CreateLembreteDto, ['candidaturaId'] as const)
) {
    @ApiProperty({ required: false, description: 'Indica se o lembrete foi concluído' })
    @IsOptional()
    @IsBoolean()
    concluido?: boolean;
}
