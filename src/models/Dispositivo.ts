import { MinLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Grupo from './Grupo';
import Predio from './Predio';
import Zona from './Zona';


@Entity('dispositivos')
@ObjectType()
export default class Dispositivo extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  nome: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  mac?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  box?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  piso?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  local?: string | null;

  @Field(() => Zona, { nullable: true })
  @ManyToOne(type => Zona, zona => zona.dispositivos, { nullable: true })
  @JoinColumn({ name: 'zonaId' })
  zona?: Zona | null;

  @Column({ nullable: true })
  zonaId?: string

  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;
}
