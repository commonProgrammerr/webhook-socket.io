import { v4 as uuid } from 'uuid';
import { getRepository } from 'typeorm';
import { Server } from 'socket.io';
import { Request, Response } from 'express';
import Event from '../models/Event';
import View, { EventFeedItem } from '../views/events_view';
import axios from 'axios';

type NewEvent = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'enable'>;

type AspSucessResponse = {
  id: string;
  success: true;
  msg?: string;
  dispositivo: number;
  descricao: string;
  instalacao: string;
  status: string;
  Alerta: string;
  modelo: string;
  local: string;
  empresa: string;
  posicao: string;
  piso: string;
  box: string;
};

type AspFailResponse = {
  id: string;
  success: false;
  msg?: string;
};

type AspResponse<R extends boolean> = R extends true
  ? AspSucessResponse
  : AspFailResponse;

const delay = (time: number) =>
  new Promise<void>((resolve, reject) => setTimeout(resolve, time));

const api_server = axios.create({
  // baseURL: 'http://miimo.a4rsolucoes.com.br/apis',
  baseURL: 'http://192.168.15.86:81/apis',
});

async function handleCreateEvent(data: NewEvent) {
  const repository = getRepository(Event);
  const newEvent = repository.create({
    ...data,
    id: uuid(),
    enable: true,
    created_at: new Date(),
  });
  return repository.save(newEvent);
}

async function handleCloseEvent(id: string) {
  const repository = getRepository(Event);
  const a = await repository.findOne({ where: { id } });
  const payload = a?.payload && JSON.parse(a?.payload);

  if (a?.type === 3) {
    if (!payload) {
      throw new Error('Invalid Event type');
    }
    await api_server.post('/agenda/atualiza/', {
      codigo: payload['codigo'],
      status: 1,
    });
  }

  return await repository.update(id, {
    enable: false,
  });
}

export default {
  push_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const { id, local, piso, type } = await handleCreateEvent(req.body);
        console.log('@event:new -', req.body.zone_id);
        io.path(req.body.zone_id).emit('@event:new', {
          id,
          local,
          piso,
          type,
        } as EventFeedItem);

        return res.status(201).send();
      } catch (error) {
        return res.status(500).json({
          code: 'Internal Error',
          msg: (error as Error).message,
        });
      }
    };
  },
  close_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const { id, zone_id } = req.body;
        await handleCloseEvent(id);
        io.path(zone_id).emit('@event:close', {
          id,
        } as EventFeedItem);

        return res.status(200).send();
      } catch (error) {
        console.log({
          code: 'Internal Error',
          msg: (error as Error).message,
          res: (error as any).response,
        });
        return res.status(500).json({
          code: 'Internal Error',
          msg: (error as Error).message,
        });
      }
    };
  },

  send_report(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const { id, usr_id, tools, type, type_obs, zone_id } = req.body;
        await api_server.post('/report/', {
          usr_id,
          oc_id: id,
          tools,
          type,
          desc: type_obs,
        });
        console.log('@event:close -', zone_id);
        await handleCloseEvent(id);
        io.path(zone_id).emit('@event:close', {
          id,
        } as EventFeedItem);

        res.status(200).send();
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          code: 'Internal Error',
          msg: (error as Error).message,
        });
      }
    };
  },

  async search(req: Request, res: Response) {
    const { id, zone_id } = req.body;

    const repository = getRepository(Event);
    const result = await repository.findOne({ where: { id } });

    if (!result)
      return res.status(404).json({
        msg: 'Inexistent or invalid ID entity',
      });

    return res.status(200).json(View.render(result));
  },

  async feed(req: Request, res: Response) {
    const { page, zone_id } = req.body;
    const page_size = 5;
    const offset = page * page_size - page_size;

    const repository = getRepository(Event);
    const result = await repository.find({
      where: { zone_id, enable: true },
      order: {
        created_at: 'DESC',
      },
    });

    return res.status(200).json({
      page: 1,
      feed: View.feed(result),
    });
  },

  alert_notify(io: Server) {
    return async (req: Request, res: Response) => {
      const url = '/registro/';
      const { VALOR, API } = req.query;
      try {
        const response = await api_server.get(url, { params: req.query });
        const { data } = response;
        if (data.success) {
          if (Number(VALOR) === 1) {
            const payload = data as AspResponse<true>;
            const zone_id = encodeURI(payload.empresa).toLowerCase();
            const { id, local, piso, type } = await handleCreateEvent({
              banheiro: payload.local,
              box: payload.box,
              local: payload.posicao,
              piso: payload.piso,
              type: 1,
              mac: String(API),
              zone_id,
            });
            console.log('@event:new -', zone_id);

            io.path(zone_id).emit('@event:new', {
              id,
              local,
              piso,
              type,
            } as EventFeedItem);
          }
          res.status(200).send();
        } else {
          res.status(400).json(response);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({
          type: (error as Error).name,
          msg: (error as Error).message,
        });
      }
    };
  },

  push_notification(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const payload = req.body as IPush_Data;
        const zone_id = encodeURI(payload.local_fisico).toLowerCase();

        const { id, local, piso, type } = await handleCreateEvent({
          banheiro: payload.local,
          local: payload.posicao,
          piso: payload.setor,
          type: 3,
          zone_id,
          description: payload.descricao,
          payload: JSON.stringify(payload),
        });
        console.log(new Date().toISOString(), '@event:new -', zone_id, id);

        io.emit('@event:new', {
          id,
          local,
          piso,
          type,
        } as EventFeedItem);

        return res.status(200).send();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          type: (error as Error).name || 'UNKNOWN',
          msg: (error as Error).message,
        });
      }
    };
  },
};

interface IPush_Data {
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
}

function required<T>(
  obj: T,
  requireds: Array<keyof T>,
  cb?: (key: keyof T) => any
) {
  for (const key of requireds) {
    if (!obj[key])
      if (cb) {
        return cb(key);
      } else {
        throw new Error(`'${key}' is a required field.`);
      }
  }
}
