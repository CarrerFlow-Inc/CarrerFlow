import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Candidatura } from "../../candidaturas/entities/candidatura.entity";
import { User } from "../../users/entities/user.entity";

@Entity('lembretes')
export class Lembrete {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    titulo!: string;

    @Column({ type: 'text', nullable: true })
    descricao?: string;

    @Column({ type: 'datetime' })
    dataLembrete!: Date;

    @Column({ default: false })
    concluido!: boolean;

    @Column({ default: false })
    notificado!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.lembretes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: string | number;

    @ManyToOne(() => Candidatura, candidatura => candidatura.lembretes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'candidaturaId' })
    candidatura?: Candidatura;

    @Column()
    candidaturaId?: string;
}
