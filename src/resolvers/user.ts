import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Like, Repository } from 'typeorm';
import { CreateUsuarioInput } from '../inputs/createUser';
import Evento from '../models/Evento';
import Grupo from '../models/Grupo';

import Usuario from '../models/Usuario';

@Resolver(Usuario)
export class UserResolver {
  // constructor(
  //   @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
  //   @InjectRepository(Evento) private readonly eventoRepository: Repository<Evento>,
  // ) { }

  @Query((returns) => Usuario, { nullable: true })
  usuario(@Arg('id', (type) => ID) id: string) {
    return Usuario.findOne(id);
  }

  @Query(() => [Usuario])
  usuarios(@Arg('search', { nullable: true }) search?: string) {
    if (!search) {
      return Usuario.find();
    } else {
      return Usuario.find({
        where: [
          { nome: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
        ]
      })
    }
  }

  @Mutation(() => Usuario)
  async createUsuario(@Arg('data') data: CreateUsuarioInput) {
    const user = Usuario.create(data);
    await user.save();
    return user;
  }

  @Mutation(() => Usuario)
  async updateUsuario(@Arg('id', (type) => ID) id: string, @Arg('data') data: CreateUsuarioInput) {
    const user = await Usuario.findOneOrFail(id);
    if (!user)
      throw new Error("User not found!");

    console.log(user, data);
    Object.assign(user, data)
    return user.save();
    ;
  }

  @Mutation(() => Usuario)
  async login(@Arg('email') email: string, @Arg('senha') senha: string) {
    const user = Usuario.findOneOrFail({
      where: {
        email,
        senha,
      },
    });
    return user;
  }

  @Mutation(() => Usuario)
  async delete(@Arg('id', (type) => ID) id: string) {
    const user = await Usuario.findOne(id);
    if (!user)
      throw new Error("User id is invalid!");

    await Usuario.softRemove([user]);
    return user;
  }
}
