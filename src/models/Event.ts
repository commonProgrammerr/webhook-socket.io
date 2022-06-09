import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum EventType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}

@Entity('events')
export default class Event {

  constructor() {
    this.id = uuid()
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  zone_id: string;

  @Column({ type: 'boolean', nullable: true })
  enable?: boolean | null;

  @Column('integer')
  type: EventType;

  @Column({ type: 'text' })
  local: string;

  @Column({ type: 'text' })
  piso: string;

  @Column({ type: 'text', nullable: true })
  box?: string | null;

  @Column({ type: 'text' })
  banheiro: string;

  @Column({ type: 'text', nullable: true })
  mac?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  payload?: string | null;

  @Column({ type: 'text', nullable: true })
  suport_type?: string | null;

  @Column({ type: 'text', nullable: true })
  local_photo?: string | null;

  @Column({ type: 'text', nullable: true })
  tool?: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
