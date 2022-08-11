import { MinLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum EventType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3,
  PEVENTIVO = 0,
}

@Entity('events')
export default class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'boolean', nullable: true })
  enable?: boolean | null;

  @Column('integer')
  @MinLength(1)
  zone_id: number;

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

  @Column({ type: 'integer', nullable: true })
  compleated_by?: number;

  @Column({ type: 'integer', nullable: true })
  request_by?: number;

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
