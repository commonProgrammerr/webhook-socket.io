import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import User from './User';

@Entity('GRUPO_USUARIO')
export default class Grupo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'codigo',
  })
  id: number;

  @Column('varchar', { name: 'descricao', nullable: true })
  nome?: string

  @OneToMany(type => User, user => user.grupo)
  @JoinColumn()
  usuarios: User[]

}
