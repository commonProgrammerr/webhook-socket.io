import { InputType, Field, ID } from "type-graphql";
import Zona from "../models/Zona";
import Usuario from "../models/Usuario";

@InputType()
export class CreateZonaInput implements Partial<Zona> {

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  local?: string;

  @Field(() => String, { nullable: true })
  piso?: string;

  @Field(() => String, { nullable: true })
  map_path?: string;

  @Field(() => String, { nullable: true })
  tipo?: string;

  @Field(() => String, { nullable: true })
  predioId?: string;

  @Field(() => String, { nullable: true })
  grupoId?: string;

  @Field(() => [String], { nullable: true })
  dispositivosIds?: string[];

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}