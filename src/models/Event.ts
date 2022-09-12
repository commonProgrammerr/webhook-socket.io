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
  RelationId,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
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
  ENVIADO = 3
}

@Entity('events')
export default class Event extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'boolean', nullable: true })
  enable?: boolean | null;

  @Column('integer', { nullable: true })
  zone_id?: number;

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
  box?: string | null;

  @Column('text')
  @MinLength(1)
  banheiro: string;

  @Column({ type: 'text', nullable: true })
  mac?: string | null;

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

  @Column('integer', { nullable: true })
  apoio_de?: number;

  @OneToOne((type) => Event, { nullable: true })
  @JoinColumn({ name: 'apoio_de' })
  apoioDe?: Event;

  @Column({ type: 'integer', nullable: true })
  request_by?: number;

  @Column({ type: 'timestamp', nullable: true })
  data_agendamento?: Date;

  @Column({ type: 'timestamp', nullable: true })
  inicio?: Date;

  @Column({ type: 'timestamp', nullable: true })
  fim?: Date;

  @Column({ type: 'text', nullable: true })
  payload?: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
