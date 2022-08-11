import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { CreateGrupoInput } from '../inputs/createGrupo';
import Grupo from '../models/Grupo';
import Usuario from '../models/Usuario';

@Resolver(Grupo)
export class GroupResolver {
  // constructor(
  //   @InjectRepository(Grupo) private readonly usuarioRepository: Repository<Grupo>,
  //   @InjectRepository(Evento) private readonly eventoRepository: Repository<Evento>,
  // ) { }

  @Query((returns) => Grupo, { nullable: true })
  grupo(@Arg('id', (type) => ID) id: string) {
    return Grupo.findOne(id);
  }

  @Query(() => [Grupo])
  grupos() {
    return Grupo.find();
  }

  @Mutation(() => Grupo)
  async createGrupo(@Arg('data') data: CreateGrupoInput) {
    const group = Grupo.create(data);
    await group.save();
    return group;
  }

  @Mutation(() => Grupo)
  async addUser(@Arg('id', (type) => ID) id: string, @Arg('user_id') user_id: string) {
    const group = await Grupo.findOneOrFail(id);
    if (!group) throw new Error('Group not found!');

    const user = await Usuario.findOneOrFail(user_id);
    if (!user) throw new Error('User not found!');

    group.usuarios = [
      ...group.usuarios,
      user
    ]

    return group.save();
  }
  @Mutation(() => Grupo)
  async updateGrupo(
    @Arg('id', (type) => ID) id: string,
    @Arg('data') data: CreateGrupoInput
  ) {
    const group = await Grupo.findOneOrFail(id);
    if (!group) throw new Error('Group not found!');

    console.log(group, data);
    Object.assign(group, data);
    return group.save();
  }

  @Mutation(() => Grupo)
  async delete(@Arg('id', (type) => ID) id: string) {
    const group = await Grupo.findOne(id);
    if (!group) throw new Error('Group id is invalid!');

    await Grupo.softRemove([group]);
    return group;
  }
}
