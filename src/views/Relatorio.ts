import { MinLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum RelatorioType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}

@Entity('events')
export default class Relatorio extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  codigo: number
  @Column()
  @Column('varchar')
  local: string
  localidade: null
  @Column('varchar')
  local_fisico: string
  @Column('varchar')
  setor: string
  @Column('varchar')
  posicao: string
  @Column('varchar')
  unidade: string
  status: null
  @Column('varchar')
  type: string
  @Column('varchar')
  tools: string
  @Column('varchar')
  papel: string
  @Column('varchar')
  toalha: string
  @Column('varchar')
  sabao: string
  @Column('varchar')
  sanitario: string
  @Column('varchar')
  mictorio: string
  @Column('varchar')
  lavador: string
  @Column('varchar')
  espelho: string
  @Column('varchar')
  chao: string
  @Column('varchar')
  lixo: string
  @Column('varchar')
  data_inclusao: string
  @Column('varchar')
  cod_card: string
  obs: null
}
