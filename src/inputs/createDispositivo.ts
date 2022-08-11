import { InputType, Field, ID } from 'type-graphql';
import Dispositivo from '../models/Dispositivo';
import Usuario from '../models/Usuario';
import Zona from '../models/Zona';

@InputType()
export class CreateDispositivoInput implements Partial<Dispositivo> {
  @Field(() => String, { nullable: true })
  nome?: string;

  @Field(() => String, { nullable: true })
  mac?: string;

  @Field(() => String, { nullable: true })
  box?: string;

  @Field(() => String, { nullable: true })
  piso?: string;

  @Field(() => String, { nullable: true })
  local?: string;

  @Field(() => String, { nullable: true })
  zonaId?: string;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
