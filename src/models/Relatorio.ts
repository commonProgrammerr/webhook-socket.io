import { MinLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Dispositivo from './Dispositivo';
import Evento from './Evento';
import Grupo from './Grupo';
import Predio from './Predio';
import Usuario from './Usuario';
import Zona from './Zona';

export enum EventType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}

@Entity('relatorios')
@ObjectType()
export default class Relatorio extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  ferramenta?: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  atividades?: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  payload?: string | null;

  @Field(() => Zona, { nullable: true })
  @ManyToOne(type => Zona, zona => zona.dispositivos, { nullable: true })
  @JoinColumn({ name: 'zonaId' })
  zona?: Zona | null;

  @Column({ nullable: true })
  zonaId?: string

  @Field(() => Usuario, { nullable: true })
  @ManyToOne(type => Usuario, user => user.relatorios, { nullable: true })
  @JoinColumn({ name: 'enviadoPorId' })
  enviado_por?: Usuario | null;

  @Column({ nullable: true })
  enviadoPorId?: string | null;

  @Column({ nullable: true })
  usuarioId?: string

  @Field(() => Evento, { nullable: true })
  @OneToOne(type => Evento, { nullable: true })
  @JoinColumn({ name: 'eventoId' })
  evento?: Evento

  @Column({ nullable: true })
  eventoId?: string

  @Field(() => Dispositivo, { nullable: true })
  @OneToOne(type => Dispositivo, { nullable: true })
  @JoinColumn({ name: 'dispositivoId' })
  dispositivo?: Evento

  @Column({ nullable: true })
  dispositivoId?: string

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
