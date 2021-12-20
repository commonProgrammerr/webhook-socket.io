import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum EventType {
  REPARO = 1,
  SUPORT = 2,
  VISTORIA = 3
}

@Entity('events')
export default class Event {

  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @Column()
  zone_id: string

  @Column()
  enable?: boolean

  @Column('integer')
  type: EventType

  @Column()
  local: string

  @Column()
  piso: string

  @Column()
  box: string

  @Column()
  banheiro: string
  
  @Column()
  mac: string

  @Column()
  description?: string

  @Column()
  suport_type?: string
  
  @Column()
  local_photo?: string
  
  @Column()
  tool?: string

  @CreateDateColumn()
  created_at: Date
  
  @UpdateDateColumn()
  updated_at: Date


}