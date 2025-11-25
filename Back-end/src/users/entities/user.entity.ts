import { Candidatura } from '../../candidaturas/entities/candidatura.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Candidatura, (candidatura) => candidatura.user, {
    cascade: true,
  })
  candidaturas!: Candidatura[];

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name!: string;
    lembretes: any;
}
