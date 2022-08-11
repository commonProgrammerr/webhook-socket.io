import { MinLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  BaseEntity,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Usuario from './Usuario';
import Zona from './Zona';

export enum GrupoType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}

@Entity('grupos')
@ObjectType()
export default class Grupo extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('varchar', { nullable: true })
  nome: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  tipo?: string | null;

  @Field(() => [Usuario])
  @OneToMany(type => Usuario, user => user.grupo, { onDelete: 'CASCADE' })
  @JoinColumn()
  usuarios: Usuario[]

  @RelationId((it: Grupo) => it.usuarios)
  usuariosIds: string[]

  @Field(() => [Zona])
  @OneToMany(type => Zona, zona => zona.grupo, { onDelete: 'CASCADE' })
  @JoinColumn()
  zonas: Zona[]

  @RelationId((it: Grupo) => it.zonas)
  zonasIds: string[]

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
