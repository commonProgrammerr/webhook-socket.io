import { MinLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
  RelationId,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Dispositivo from './Dispositivo';
import Grupo from './Grupo';
import Predio from './Predio';
import Usuario from './Usuario';
import Zona from './Zona';

export enum TipoEvento {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}
export enum StatusEvento {
  EM_ATENDIMENTO = 0,
  ENVIADO = 1,
  AGENDADO = 2,
  URGENTE = 3,
}

@Entity('eventos')
@ObjectType()
export default class Evento extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('varchar', { nullable: true })
  nome?: string | null;

  @Field(() => Boolean, { nullable: true })
  @Column('boolean', { nullable: false, default: true })
  enable?: boolean | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  local?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  piso?: string | null;

  @Field(() => Number, { nullable: true })
  @Column('integer', { nullable: true })
  tipo?: number | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  banheiro?: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  payload?: string | null;

  @Field(() => Date)
  @Column('timestamp', { nullable: true })
  inicio: Date | null;

  @Field(() => Date)
  @Column('timestamp', { nullable: true })
  fim: Date | null;

  @Field(() => Number)
  @Column('integer', { nullable: true })
  status?: StatusEvento

  @Field(() => Date)
  @Column('timestamp', { nullable: true })
  data_agendamento?: Date

  @Field(() => Zona, { nullable: true })
  @OneToOne((type) => Zona, { nullable: true })
  @JoinColumn()
  zona?: Zona | null;

  @RelationId((it: Evento) => it.zona)
  zonaId?: string

  @Field(() => Dispositivo, { nullable: true })
  @OneToOne((type) => Dispositivo, { nullable: true })
  @JoinColumn()
  dispositivo?: Dispositivo | null;

  @RelationId((it: Evento) => it.dispositivo)
  dispositivoId?: string

  @Field(() => Usuario, { nullable: true })
  @ManyToOne((type) => Usuario, (user) => user.eventos, { nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: Usuario | null;

  @Column({ nullable: true })
  usuarioId?: string

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ nullable: true })
  created_at?: Date | null;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  updated_at?: Date | null;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date | null;
}
