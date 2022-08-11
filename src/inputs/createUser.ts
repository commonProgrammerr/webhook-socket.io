import { InputType, Field, ID } from "type-graphql";
import Usuario from "../models/Usuario";

@InputType()
export class CreateUsuarioInput implements Partial<Usuario> {

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  senha?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  grupoId?: string;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}