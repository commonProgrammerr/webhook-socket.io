import { IPush_Data } from '../controllers/event';
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
      banheiro: event.banheiro,
      box: event.box,
      created_at: event.created_at,
      local: event.local,
      piso: event.piso,
      type: event.type,
      description: event.description,
      mac: event.mac
    };
  },

  renderMany(events: Event[]): EventDTO[] {
    return events.map((event) => this.render(event));
  },

  feed(events: Event[]): EventFeedItem[] {
    return events.map((event) => {
      const payload = JSON.parse(event.payload || '{}') as EventPayload;
      const date_array = payload?.dataeventoinicial?.split('/');
      const timestamp =
        (event.type !== 3)
          ? event.created_at.toISOString()
          : payload.timestamp ||
          `${date_array[2]}-${date_array[1]}-${date_array[0]}T${payload.horaevento}.000-03:00`;

      return {
        id: event.id,
        local: event.local,
        piso: event.piso,
        type: event.type,
        time: event.payload && timestamp,
      };
    });
  },
};
