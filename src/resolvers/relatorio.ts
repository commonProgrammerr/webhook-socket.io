import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Like } from 'typeorm';
import { CreateRelatorioInput, SearchRelatorioInput } from '../inputs/createRelatorio';
import Relatorio from '../models/Relatorio';
import Zona from '../models/Zona';

@Resolver(Relatorio)
export class ReportResolver {

  @Query((returns) => Relatorio, { nullable: true })
  relatorio(@Arg('id', (type) => ID) id: string) {
    return Relatorio.findOne(id);
  }

  @Query(() => [Relatorio])
  relatorios(@Arg('search', () => SearchRelatorioInput, { nullable: true }) search?: SearchRelatorioInput) {
    if (!search) {
      return Relatorio.find();
    } else {
      const fields = Object.keys(search);
      return Relatorio.find({
        where: fields.map((field) => {
          const search_field = search[field as keyof typeof search]
          return {
            [field]: search_field instanceof String ? Like(`%${search_field}%`) : search_field
          }
        }),
      });
    }
  }

  @Mutation(() => Relatorio)
  async createRelatorio(@Arg('data') data: CreateRelatorioInput) {
    const building = Relatorio.create(data);
    await building.save();
    return building;
  }

  @Mutation(() => Relatorio)
  async updateRelatorio(
    @Arg('id', (type) => ID) id: string,
    @Arg('data') data: CreateRelatorioInput
  ) {
    const building = await Relatorio.findOneOrFail(id);
    if (!building) throw new Error('Report not found!');

    console.log(building, data);
    Object.assign(building, data);
    return building.save();
  }

  @Mutation(() => Relatorio)
  async delete(@Arg('id', (type) => ID) id: string) {
    const building = await Relatorio.findOne(id);
    if (!building) throw new Error('Report id is invalid!');

    await Relatorio.softRemove([building]);
    return building;
  }
}
