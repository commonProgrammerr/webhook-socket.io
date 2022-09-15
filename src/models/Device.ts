import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('APIs')
export default class Device extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'codigo',
  })
  id: number;

  @Column('varchar', { nullable: true })
  API?: string

  @Column('varchar', { nullable: true })
  valor?: string

  @Column('datetime', { nullable: true })
  hora?: string

}
