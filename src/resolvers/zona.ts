import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Like } from 'typeorm';
import { CreateZonaInput } from '../inputs/createZona';
import Dispositivo from '../models/Dispositivo';
import Zona from '../models/Zona';


@Resolver(Zona)
export class ZoneResolver {
  // constructor(
  //   @InjectRepository(Zona) private readonly usuarioRepository: Repository<Zona>,
  //   @InjectRepository(Evento) private readonly eventoRepository: Repository<Evento>,
  // ) { }

  @Query((returns) => Zona, { nullable: true })
  zona(@Arg('id', (type) => ID) id: string) {
    return Zona.findOne(id);
  }

  @Query(() => [Zona])
  zonas(@Arg('search', { nullable: true }) search?: string) {
    if (!search) {
      return Zona.find();
    } else {
      return Zona.find({
        where: [{ nome: Like(`%${search}%`) }, { local: Like(`%${search}%`) }],
      });
    }
  }

  @Mutation(() => Zona)
  async createZona(@Arg('data') data: CreateZonaInput) {
    const zona = Zona.create(data);
    await zona.save();
    return zona;
  }

  @Mutation(() => Zona)
  async addDevice(@Arg('id', (type) => ID) id: string, @Arg('device_id') device_id: string) {
    const zona = await Zona.findOneOrFail(id);
    if (!zona) throw new Error('Zone not found!');

    const device = await Dispositivo.findOneOrFail(device_id);
    if (!device) throw new Error('Device not found!');

    zona.dispositivos = [...zona.dispositivos, device];

    return zona.save();
  }

  @Mutation(() => Zona)
  async updateZona(
    @Arg('id', (type) => ID) id: string,
    @Arg('data') data: CreateZonaInput
  ) {
    const zona = await Zona.findOneOrFail(id);
    if (!zona) throw new Error('Zone not found!');

    console.log(zona, data);
    Object.assign(zona, data);
    return zona.save();
  }

  @Mutation(() => Zona)
  async delete(@Arg('id', (type) => ID) id: string) {
    const zona = await Zona.findOne(id);
    if (!zona) throw new Error('Zone id is invalid!');

    await Zona.softRemove([zona]);
    return zona;
  }
}
