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
  BaseEntity,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Dispositivo from './Dispositivo';
import Grupo from './Grupo';
import Predio from './Predio';

export enum EventType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}

@Entity('zonas')
@ObjectType()
export default class Zona extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  nome?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  local?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  piso?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  map_path?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  tipo?: string | null;

  @Field(() => Predio, { nullable: true })
  @ManyToOne((type) => Predio, (predio) => predio.zonas, { nullable: true })
  @JoinColumn({ name: 'predioId' })
  predio?: Predio | null;

  @Column({ nullable: true })
  predioId?: string

  @Field(() => Grupo, { nullable: true })
  @ManyToOne((type) => Grupo, (grupo) => grupo.zonas, { nullable: true })
  @JoinColumn()
  grupo?: Grupo | null;

  @RelationId((it: Zona) => it.grupo)
  grupoId?: string

  @Field(() => [Dispositivo])
  @OneToMany((type) => Dispositivo, (dispositivo) => dispositivo.zona, { onDelete: 'CASCADE' })
  @JoinColumn()
  dispositivos: Dispositivo[];

  @RelationId((it: Zona) => it.dispositivos)
  dispositivosIds: string[]

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
