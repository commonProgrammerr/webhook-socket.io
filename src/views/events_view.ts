import Event from '../models/Event';

export type EventDTO = Omit<Partial<Event>, 'enable' | 'updated_at' | 'zone_id'>
export type EventFeedItem = Pick<Event, 'id' | 'type' | 'local' | 'piso'>


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
      return {
        id: event.id,
        local: event.local,
        piso: event.piso,
        type: event.type
      }
    });
  }
};