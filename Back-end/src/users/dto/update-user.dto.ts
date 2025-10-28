import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'nova_senha123',
    minLength: 6,
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Nome do usuário',
    example: 'João Silva Atualizado',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  name?: string;
}
