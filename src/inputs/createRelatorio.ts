import { InputType, Field, ID } from 'type-graphql';
import Relatorio from '../models/Relatorio';

@InputType()
export class CreateRelatorioInput implements Partial<Relatorio> {
  @Field(() => String, { nullable: true })
  ferramenta?: string;

  @Field(() => String, { nullable: true })
  atividades?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  payload?: string;

  @Field(() => String, { nullable: true })
  zonaId?: string;

  @Field(() => String, { nullable: true })
  enviadoPorId?: string;

  @Field(() => String, { nullable: true })
  usuarioId?: string;

  @Field(() => String, { nullable: true })
  eventoId?: string;

  @Field(() => String, { nullable: true })
  dispositivoId?: string;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}

@InputType()
export class SearchRelatorioInput implements Partial<Relatorio> {
  @Field(() => String, { nullable: true })
  ferramenta?: string;

  @Field(() => String, { nullable: true })
  atividades?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  payload?: string;

  @Field(() => String, { nullable: true })
  zonaId?: string;

  @Field(() => String, { nullable: true })
  enviadoPorId?: string;

  @Field(() => String, { nullable: true })
  usuarioId?: string;

  @Field(() => String, { nullable: true })
  eventoId?: string;

  @Field(() => String, { nullable: true })
  dispositivoId?: string;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
