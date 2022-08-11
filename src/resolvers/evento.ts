import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Like } from 'typeorm';
import { CreateEventoInput, SearchEventoInput } from '../inputs/createEvento';
import Evento from '../models/Evento';

@Resolver(Evento)
export class EventResolver {
  // constructor(
  //   @InjectRepository(Evento) private readonly usuarioRepository: Repository<Evento>,
  //   @InjectRepository(Evento) private readonly eventoRepository: Repository<Evento>,
  // ) { }

  @Query(() => Evento, { nullable: true })
  evento(@Arg('id', (type) => ID) id: string) {
    return Evento.findOne(id);
  }

  @Query(() => [Evento])
  eventos(@Arg('search', () => SearchEventoInput, { nullable: true }) search?: SearchEventoInput) {
    if (!search) {
      return Evento.find();
    } else {
      const fields = Object.keys(search);
      return Evento.find({
        where: fields.map((field) => {
          const search_field = search[field as keyof typeof search]
          return {
            [field]: search_field instanceof String ? Like(`%${search_field}%`) : search_field
          }
        }),
      });
    }
  }

  @Mutation(() => Evento)
  async createEvento(@Arg('data') data: CreateEventoInput) {
    const event = Evento.create(data);
    await event.save();
    return event;
  }

  @Mutation(() => Evento)
  async updateEvento(
    @Arg('id', (type) => ID) id: string,
    @Arg('data') data: CreateEventoInput
  ) {
    const event = await Evento.findOneOrFail(id);
    if (!event) throw new Error('Event not found!');

    console.log(event, data);
    Object.assign(event, data);
    return event.save();
  }

  @Mutation(() => Evento)
  async delete(@Arg('id', (type) => ID) id: string) {
    const event = await Evento.findOne(id);
    if (!event) throw new Error('Event id is invalid!');

    await Evento.softRemove([event]);
    return event;
  }
}
