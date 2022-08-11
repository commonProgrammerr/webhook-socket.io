import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Like } from 'typeorm';
import { CreatePredioInput } from '../inputs/createPredio';
import Predio from '../models/Predio';
import Usuario from '../models/Usuario';
import Zona from '../models/Zona';

@Resolver(Predio)
export class BuildingResolver {
  // constructor(
  //   @InjectRepository(Predio) private readonly usuarioRepository: Repository<Predio>,
  //   @InjectRepository(Evento) private readonly eventoRepository: Repository<Evento>,
  // ) { }

  @Query((returns) => Predio, { nullable: true })
  predio(@Arg('id', (type) => ID) id: string) {
    return Predio.findOne(id);
  }

  @Query(() => [Predio])
  predios(@Arg('search', { nullable: true }) search?: string) {
    if (!search) {
      return Predio.find();
    } else {
      return Predio.find({
        where: [{ nome: Like(`%${search}%`) }, { local: Like(`%${search}%`) }],
      });
    }
  }

  @Mutation(() => Predio)
  async createPredio(@Arg('data') data: CreatePredioInput) {
    const building = Predio.create(data);
    await building.save();
    return building;
  }

  @Mutation(() => Predio)
  async addZone(@Arg('id', (type) => ID) id: string, @Arg('zona_id') zona_id: string) {
    const building = await Predio.findOneOrFail(id);
    if (!building) throw new Error('Building not found!');

    const zona = await Zona.findOneOrFail(zona_id);
    if (!zona) throw new Error('Zone not found!');

    building.zonas = [...building.zonas, zona];

    return building.save();
  }

  @Mutation(() => Predio)
  async updatePredio(
    @Arg('id', (type) => ID) id: string,
    @Arg('data') data: CreatePredioInput
  ) {
    const building = await Predio.findOneOrFail(id);
    if (!building) throw new Error('Building not found!');

    console.log(building, data);
    Object.assign(building, data);
    return building.save();
  }

  @Mutation(() => Predio)
  async delete(@Arg('id', (type) => ID) id: string) {
    const building = await Predio.findOne(id);
    if (!building) throw new Error('Building id is invalid!');

    await Predio.softRemove([building]);
    return building;
  }
}
