import Event from '../models/Event';

export type EventDTO = Omit<Partial<Event>, 'enable' | 'updated_at' | 'zone_id'>
export type EventFeedItem = Pick<Event, 'id' | 'type' | 'local' | 'piso'>

interface EventPayload {
  codigoItemAgenda: number;
  grupo: string; //'Administrador',
  local_fisico: string; //'Aeroporto Internacional dos Guararapes',
  local: string; //'Banheiro Masculino',
  setor: string; //'Segundo ANDAR',
  posicao: string; //'Corredor 001',
  descricao: string; //'Limpar Piso',
  dataeventoinicial: string; //'09/04/2022',
  dataeventofinal: string; //'09/04/2022',
  horaevento: string; //'18:15:00',
  status: null;
  timestamp: string;
}

export default {
  render(event: Event): EventDTO {
    return {
      id: event.id,
      banheiro: event.banheiro ?? undefined,
      box: event.box ?? undefined,
      created_at: event.created_at ?? undefined,
      local: event.local ?? undefined,
      piso: event.piso ?? undefined,
      type: event.type ?? undefined,
      description: event.description ?? undefined,
      mac: event.mac ?? undefined,
      requestBy: event.requestBy ?? undefined,
      data_agendamento: event.data_agendamento ?? undefined,
    };
  },

  renderMany(events: Event[]): EventDTO[] {
    return events.map((event) => this.render(event));
  },

  feed(events: Event[]): EventFeedItem[] {
    return events.map((event) => {
      return {
        id: event.id,
        local: event.local,
        piso: event.piso,
        type: event.type,
        time: event.data_agendamento,
      };
    });
  },
};
