import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import Event from './Event';

@Entity('AGENDAMANUTENCAO')
export default class Agenda extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'codigo',
  })
  id: number;


  @Column('varchar', { nullable: true })
  DESCRICAO?: string

  @Column('varchar', { nullable: true })
  horaevento?: string

  @Column('varchar', { nullable: true })
  tipo_agendamento?: string

  @Column('varchar', { nullable: true })
  agendamanutencaocol?: string

  @Column('integer', { nullable: true })
  status?: number

  @Column('integer', { nullable: true })
  cod_setor?: number

  @Column('integer', { nullable: true })
  cod_local?: number

  @Column('integer', { nullable: true })
  cod_posicao?: number

  @Column('integer', { nullable: true })
  cod_unidade?: number

  @Column('integer', { nullable: true })
  cod_grupo_resp?: number

  @Column('varchar', { nullable: true, length: 45 })
  cod_dispositivo?: string

  @Column('integer', { nullable: true })
  cod_local_fisico?: number

  @Column('integer', { nullable: true })
  cod_usu_solicitante?: number

  @Column('datetime', { nullable: true })
  dataeventofinal?: Date

  @Column('datetime', { nullable: true })
  dataeventoinicial?: Date

  @Column('datetime', { nullable: true })
  execucao_em?: Date

  @Column('datetime', { nullable: true })
  finalizado_em?: Date

  static assing_event(event: Event) {
    return {
      finalizado_em: event.fim,
      execucao_em: event.inicio,
      dataeventoinicial: event.data_agendamento,
      dataeventofinal: event.data_agendamento,
      DESCRICAO: event.description,
      cod_dispositivo: event.mac,
      cod_usu_solicitante: event.request_by,
      status: event.status,
      horaevento: event.data_agendamento?.toTimeString()
    }
  }
}
