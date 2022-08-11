import { InputType, Field, ID } from 'type-graphql';
import Grupo from '../models/Grupo';
import Usuario from '../models/Usuario';
import Zona from '../models/Zona';

@InputType()
export class CreateGrupoInput implements Partial<Grupo> {
  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => [String], { nullable: true })
  usuariosIds?: string[];

  @Field(() => [String], { nullable: true })
  zonasIds?: string[];

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
