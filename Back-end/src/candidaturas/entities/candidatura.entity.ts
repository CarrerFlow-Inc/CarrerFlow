import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum StatusCandidatura {
  APLICADA = 'Aplicada',
  ENTREVISTA_RH = 'Entrevista com TH',
  ENTREVISTA_TECNICA = 'Entrevista Técnica',
  ENTREVISTA_FINAL = 'Entrevista Final',
  OFERTA_RECEBIDA = 'Oferta Recebida',
  ACEITA = 'Aceita',
  REJEITADA = 'Rejeitada',
  CANCELADA = 'Cancelada',
}

@Entity('candidaturas')
export class Candidatura {
  @ApiProperty({
    description: 'ID único da candidatura',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Mapear explicitamente o join column para garantir consistência
  @ManyToOne(() => User, (user) => user.candidaturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @ApiProperty({
    description: 'Nome da empresa',
    example: 'Tech Solutions',
  })
  @Column()
  nomeEmpresa!: string;

  @ApiProperty({
    description: 'Título da vaga',
    example: 'Desenvolvedor Full Stack Júnior',
  })
  @Column()
  tituloVaga!: string;

  @ApiProperty({
    description: 'Data de aplicação',
    example: '2025-10-15',
    type: String,
    format: 'date',
  })
  @Column()
  dataCandidatura!: Date;

  @ApiProperty({
    description: 'Link para a vaga',
    example: 'https://techsolutions.com/vagas/desenvolvedor-fullstack-junior',
  })
  @Column({ type: 'text', nullable: true })
  linkVaga!: string | null;

  @ApiProperty({
    description: 'Status atual da candidatura',
    enum: StatusCandidatura,
    example: StatusCandidatura.APLICADA,
  })
  @Column({
    type: 'text',
    default: StatusCandidatura.APLICADA,
  })
  status!: StatusCandidatura;

  @ApiProperty({
    description: 'Anotações sobre a candidatura',
    example: 'Primeira entrevista marcada para 20/10.',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  observacoes!: string | null;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-10-15T10:30:00.000Z',
  })
  // Mapear explicitamente para o nome de coluna `createdAt` usado em queries
  @CreateDateColumn({ name: 'createdAt' })
  dataCriacao!: Date;

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2025-10-16T14:20:00.000Z',
  })
  // Mapear explicitamente para o nome de coluna `updatedAt` usado em queries
  @UpdateDateColumn({ name: 'updatedAt' })
  dataAtualizacao!: Date;
  lembretes: any;
  createdAt: string | number | Date | undefined;
}
