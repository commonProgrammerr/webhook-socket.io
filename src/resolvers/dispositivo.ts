import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Like } from 'typeorm';
import { CreateDispositivoInput } from '../inputs/createDispositivo';
import Dispositivo from '../models/Dispositivo';
import Usuario from '../models/Usuario';
import Zona from '../models/Zona';

@Resolver(Dispositivo)
export class DeviceResolver {
  // constructor(
  //   @InjectRepository(Dispositivo) private readonly usuarioRepository: Repository<Dispositivo>,
  //   @InjectRepository(Evento) private readonly eventoRepository: Repository<Evento>,
  // ) { }

  @Query((returns) => Dispositivo, { nullable: true })
  dispositivo(@Arg('id', (type) => ID) id: string) {
    return Dispositivo.findOne(id);
  }

  @Query(() => [Dispositivo])
  relatorios(@Arg('search', () => CreateDispositivoInput, { nullable: true }) search?: CreateDispositivoInput) {
    if (!search) {
      return Dispositivo.find();
    } else {
      const fields = Object.keys(search);
      return Dispositivo.find({
        where: fields.map((field) => {
          const search_field = search[field as keyof typeof search]
          return {
            [field]: search_field instanceof String ? Like(`%${search_field}%`) : search_field
          }
        }),
      });
    }
  }

  @Mutation(() => Dispositivo)
  async createDispositivo(@Arg('data') data: CreateDispositivoInput) {
    const building = Dispositivo.create(data);
    await building.save();
    return building;
  }

  @Mutation(() => Dispositivo)
  async updateDispositivo(
    @Arg('id', (type) => ID) id: string,
    @Arg('data') data: CreateDispositivoInput
  ) {
    const building = await Dispositivo.findOneOrFail(id);
    if (!building) throw new Error('Device not found!');

    console.log(building, data);
    Object.assign(building, data);
    return building.save();
  }

  @Mutation(() => Dispositivo)
  async delete(@Arg('id', (type) => ID) id: string) {
    const building = await Dispositivo.findOne(id);
    if (!building) throw new Error('Device id is invalid!');

    await Dispositivo.softRemove([building]);
    return building;
  }
}
