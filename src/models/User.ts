import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@Entity('USUARIO')
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'codigo',
  })
  id: number;

  @Column('varchar', { length: 100 })
  usuario: string;

  @Column('varchar', { length: 100 })
  senha: string;

  @Column('integer')
  cod_empresa: number;

  @Column('integer')
  cod_status: number;

  @Column('integer')
  cod_grupo_usuario: number;

  @Column('integer')
  cod_situacao: number;

  @Column('integer')
  cod_nivel: number;

  @Column('varchar', { nullable: true, length: 200 })
  nome?: string;

  @Column('varchar', { nullable: true, length: 100 })
  email?: string;

  @Column('varchar', { nullable: true, length: 45 })
  telefone?: string;

  @Column('varchar', { length: 11 })
  cpf: string;
}

