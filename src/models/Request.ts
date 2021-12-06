import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";


export enum RequestsTypes {
  ENTUPIMENTO = 1,
  AJUDA = 2,
  FINALIZADO = 0
}


@Entity('requests')
export default class Request {
  
  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @Column({
    type: 'simple-enum',
    enum: RequestsTypes
  })
  type: number
  
  @Column()
  local: string
  
  @Column()
  piso: string
  
  @Column()
  box: number
  
  @Column()
  genero: string
  
  @Column()
  description?: string
  
  @Column()
  suport_type?: string

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date

}