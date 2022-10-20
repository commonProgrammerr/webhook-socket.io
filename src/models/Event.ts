import { MinLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  OrderByCondition,
} from 'typeorm';
import Agenda from './Agenda';
import Grupo from './Grupo';
import User from './User';

export enum EventType {
  REPARO = 1,
  SUPORT = 2,
  PEVENTIVO = 3,
}

export enum Status {
  PROGRAMADO = 0,
  EXECUTADO = 1,
  EM_ANDAMENTO = 2,
  ENVIADO = 3,
}

@Entity('events')
export default class Event extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', nullable: true })
  enable?: boolean;

  @Column('integer', { nullable: true })
  zone_id?: number;

  @OneToOne((type) => Grupo, { nullable: true })
  @JoinColumn({ name: 'zone_id' })
  grupo?: Grupo;

  @Column('integer', { nullable: true })
  status?: Status;

  @Column('integer')
  type: EventType;

  @Column('text')
  @MinLength(1)
  local: string;

  @Column('text')
  @MinLength(1)
  piso: string;

  @Column({ type: 'text', nullable: true })
  box?: string;

  @Column('text')
  @MinLength(1)
  banheiro: string;

  @Column({ type: 'text', nullable: true })
  mac?: string;

  @Column({ type: 'text', nullable: true })
  local_fisico?: string;

  @Column({ type: 'text', nullable: true })
  OBS?: string;

  @Column({ type: 'integer', nullable: true })
  relatorio_id?: number;

  @OneToOne((type) => User, { nullable: true })
  @JoinColumn({ name: 'compleated_by' })
  compleatedBy?: User;

  @Column('integer', { nullable: true })
  compleated_by?: number;

  @OneToOne((type) => User, { nullable: true })
  @JoinColumn({ name: 'request_by' })
  requestBy?: User;

  @Column('integer', { nullable: true, unique: false })
  apoio_de?: number;

  @OneToOne((type) => Event, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'apoio_de' })
  apoioDe?: Event;

  @Column('integer', { nullable: true, unique: false })
  id_agendamanutencao?: number;

  @OneToOne((type) => Agenda, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_agendamanutencao' })
  agenda?: Agenda;

  @Column({ type: 'integer', nullable: true })
  request_by?: number;

  @Column({ type: 'timestamp', nullable: true })
  data_agendamento?: Date;

  @Column({ type: 'timestamp', nullable: true })
  inicio?: Date;

  @Column({ type: 'timestamp', nullable: true })
  fim?: Date;

  @Column({ type: 'text', nullable: true })
  payload?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  clone(event: Partial<Event>) {
    const { banheiro, local, piso, zone_id, box, mac, payload, description } = this;
    return Event.create({
      ...this,
      ...event,
      data_agendamento: undefined,
      inicio: undefined,
      fim: undefined,
      created_at: undefined,
      updated_at: undefined
    });
  }
}
