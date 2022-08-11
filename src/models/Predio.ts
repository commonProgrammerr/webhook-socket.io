import { MinLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BaseEntity,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Zona from './Zona';


@Entity('predios')
@ObjectType()
export default class Predio extends BaseEntity {


  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar')
  nome?: null | string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { unique: true })
  local?: null | string;

  @Field(() => String, { nullable: true })
  @Column('varchar')
  map_path?: null | string;

  @Field(() => String, { nullable: true })
  @Column('varchar')
  tipo?: null | string;

  @Field(() => [Zona])
  @OneToMany(type => Zona, zona => zona.predio, { onDelete: 'CASCADE' })
  @JoinColumn()
  zonas: Zona[];

  @RelationId((it: Predio) => it.zonas)
  zonasIds?: string[]

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at: Date | null;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at: Date | null;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  deleted_at: Date | null;
}
