import { InputType, Field, ID } from 'type-graphql';
import Evento from '../models/Evento';

@InputType()
export class CreateEventoInput implements Partial<Evento> {
  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => Number, { nullable: true })
  tipo?: number;

  @Field(() => String, { nullable: true })
  local?: string;

  @Field(() => String, { nullable: true })
  piso?: string;

  @Field(() => String, { nullable: true })
  banheiro?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  dispositivoId?: string;

  @Field(() => String, { nullable: true })
  usuarioId?: string;

  @Field(() => String, { nullable: true })
  zonaId?: string

  @Field(() => Date, { nullable: true })
  inicio?: Date;

  @Field(() => Date, { nullable: true })
  fim?: Date;

  @Field(() => Date, { nullable: true })
  send_at?: Date;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}


@InputType()
export class SearchEventoInput implements Partial<Evento> {
  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => Boolean, { nullable: true })
  enable?: boolean;

  @Field(() => Number, { nullable: true })
  tipo?: number;

  @Field(() => String, { nullable: true })
  local?: string;

  @Field(() => String, { nullable: true })
  piso?: string;

  @Field(() => String, { nullable: true })
  banheiro?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  dispositivoId?: string;

  @Field(() => String, { nullable: true })
  usuarioId?: string;

  @Field(() => String, { nullable: true })
  zonaId?: string

  @Field(() => Date, { nullable: true })
  inicio?: Date;

  @Field(() => Date, { nullable: true })
  fim?: Date;

  @Field(() => Date, { nullable: true })
  send_at?: Date;
}