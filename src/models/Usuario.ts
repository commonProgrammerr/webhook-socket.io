import { MinLength } from 'class-validator';
import { type } from 'os';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinTable,
  ManyToOne,
  OneToMany,
  BaseEntity,
  JoinColumn,
  RelationId
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Evento from './Evento';
import Grupo from './Grupo';
import Relatorio from './Relatorio';
import { ObjectType, Field, ID } from "type-graphql";

@Entity('usuarios')
@ObjectType()
export default class Usuario extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  nome: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', {
    unique: true,
    nullable: true
  })
  email?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  senha?: string | null;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  tipo?: string | null;

  @Field(() => Grupo, { nullable: true })
  @ManyToOne(type => Grupo, grupo => grupo.usuarios, { nullable: true })
  @JoinColumn({ name: 'grupoId' })
  grupo?: Grupo | null;

  @Column()
  grupoId?: string

  @Field(() => [Evento])
  @OneToMany(type => Evento, ev => ev.usuario, { lazy: true })
  @JoinColumn()
  eventos: Evento[];

  @RelationId((it: Usuario) => it.eventos)
  eventosIds: string[]

  @Field(() => [Relatorio])
  @OneToMany(type => Relatorio, ev => ev.enviado_por, { lazy: true })
  @JoinColumn()
  relatorios: Relatorio[];

  @RelationId((it: Usuario) => it.relatorios)
  relatoriosIds: string[]

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
