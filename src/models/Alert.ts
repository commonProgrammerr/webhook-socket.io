import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";



@Entity('alerts')
export default class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column()
  alert_status: number
  @Column()
  device_mac: string
  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
}