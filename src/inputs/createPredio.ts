import { InputType, Field, ID } from "type-graphql";
import Predio from "../models/Predio";
import Zona from "../models/Zona";

@InputType()
export class CreatePredioInput implements Partial<Predio> {

  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  local?: null | string;

  @Field(() => String, { nullable: true })
  map_path?: null | string;

  @Field(() => String, { nullable: true })
  tipo?: null | string;

  @Field(() => [String], { nullable: true })
  zonasIds?: string[]

  @Field(() => Date, { nullable: true })
  deleted_at?: Date | null;
}