import { uuid } from 'uuidv4';
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

        const url = 'http://miimo.a4rsolucoes.com.br/apis/report/';
        await axios.post(url, {
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
    const result = await repository.findOne({
      where: { id },
    });

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
      const url = 'http://miimo.a4rsolucoes.com.br/apis/registro/';
      const { VALOR, API } = req.query;
      try {
        const response = await axios.get(url, { params: req.query });
        const { data } = response;

        if (data.success) {
          if (Number(VALOR) === 1) {
            const infos = data as AspResponse<true>;
            const zone_id = encodeURI(infos.empresa).toLowerCase();
            console.log(zone_id);
            const { id, local, piso, type } = await handleCreateEvent({
              banheiro: infos.local,
              box: infos.box,
              local: infos.posicao,
              piso: infos.piso,
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
        const { local, posicao, piso, type, zone_id, description } = req.query;
        if (!zone_id) {
          return res.status(400).json({
            type: 'INVALID_FIELD',
            msg: "'zone_id' is a required field."
          })
        }
        console.log('@event:push -', zone_id);

        const result = io.path(encodeURI(String(zone_id))).emit('@event:push', {
          banheiro: local,
          local: posicao,
          piso,
          type,
          description
        });
        return res.status(200).send()
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
