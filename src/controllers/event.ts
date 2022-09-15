import { v4 as uuid } from 'uuid';
import { getRepository } from 'typeorm';
import { Server } from 'socket.io';
import { Request, Response } from 'express';
import Event from '../models/Event';
import View, { EventFeedItem } from '../views/events_view';
import axios, { AxiosError } from 'axios';
import { validate } from 'class-validator';
import User from '../models/User'
import Agenda from '../models/Agenda';
import Device from '../models/Device';

type NewEvent = Omit<Partial<Event>, 'id' | 'created_at' | 'updated_at' | 'enable'>;

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
  timestamp: string;
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
  baseURL: 'http://miimo.a4rsolucoes.com.br/apis', // online,
  // baseURL: 'http://192.168.15.86:81/apis', // casa
  // baseURL: 'http://192.168.230.221:81/apis', // 4G
});

async function handleCreateEvent(data: NewEvent) {
  try {
    const repository = getRepository(Event);
    return await repository.manager.transaction(async manager => {

      let newEvent = Event.create<Event>({
        ...data,
        enable: true,
      });
      const errors = await validate(newEvent);

      if (errors.length > 0) {
        throw new Error(`Validation failed! Wrong field.`);
      } else {
        let agenda = Agenda.create<Agenda>({
          cod_grupo_resp: newEvent.zone_id,
          finalizado_em: newEvent.fim,
          execucao_em: newEvent.inicio,
          dataeventoinicial: newEvent.data_agendamento,
          dataeventofinal: newEvent.data_agendamento,
          DESCRICAO: newEvent.description,
          cod_dispositivo: newEvent.mac,
          cod_usu_solicitante: newEvent.request_by,
          status: newEvent.status,
          horaevento: newEvent.data_agendamento?.toTimeString()
        })
        await manager.save(agenda);
        return await manager.save(newEvent);
      }
    })

  } catch (err) {
    throw err
  }
}

async function handleCloseEvent(id: string, ev?: Event) {
  const repository = getRepository(Event);
  const a = ev || (await repository.findOne({ where: { id } }));
  const payload = a?.payload && JSON.parse(a?.payload);

  if (a?.type === 3) {
    if (!payload) {
      throw new Error('Invalid Event type');
    }
    console.log(payload);
    const resp = await api_server.post('/agenda/atualiza/', {
      codigo: payload['codigo'],
      status: 1,
    });

    console.log(resp.status);
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
  suport_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const original = await getRepository(Event).findOneOrFail(req.body.id)
        const suport_event = await handleCreateEvent({
          banheiro: original.banheiro,
          local: original.local,
          piso: original.piso,
          zone_id: original.zone_id,
          box: original.box,
          description: req.body.description,
          mac: original.mac,
          payload: original.payload,
          request_by: req.body.user_id,
          apoio_de: req.body.id,
          type: 2
        });
        const { id, local, piso, type, zone_id, request_by } = suport_event

        const requisitor = await User.findOne(request_by)

        console.log('@event:suport', zone_id);
        io.emit('@event:new', {
          id,
          local,
          piso,
          type,
          request_by: requisitor?.nome
        });

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
        const { id } = req.body;
        const event = await Event.findOne({ where: { id } });
        if (event) {
          event.fim = new Date();
          await event.save()
          io.emit('@event:close', {
            id: event.id,
          } as EventFeedItem);
        }
        return res.status(200).send();
      } catch (error) {
        if ((error as AxiosError)?.isAxiosError) {
          const err = error as AxiosError;
          console.error(err.response?.data)
          res.status(err.response?.status || 400).json(err.response?.data);
        } else {
          console.error((error as Error).message);
          res.status(500).json({
            type: 'Internal Error',
            msg: (error as Error).message,
          });
        }
      }
    };
  },

  async search(req: Request, res: Response) {
    const { id } = req.body;
    const result = await Event.findOne({
      where: { id },
      relations: [
        'requestBy'
      ]
    });

    if (!result) {
      return res.status(404).json({
        msg: 'Inexistent or invalid ID entity',
      });
    }

    return res.status(200).json(View.render(result));
  },

  async feed(req: Request, res: Response) {
    const { page, user_id } = req.body;

    if (page <= 0 || !user_id) {
      return res.status(400).json({
        msg: 'Invalid page',
      });
    }

    const page_size = 5;
    const offset = ((page ?? 1) - 1) * page_size;

    const result = await Event.find({
      where: [{ enable: true }, { enable: false, compleated_by: user_id, fim: null }],
      order: {
        created_at: 'DESC',
      },
      skip: offset,
      take: page_size,
    });


    return res.status(200).json({
      page,
      feed: View.feed(result),
    });
  },

  acept(io: Server) {
    return async (req: Request, res: Response) => {
      const { id, user_id } = req.body;
      try {

        const event = await Event.findOne({ where: { id } });
        if (event) {
          event.enable = false;
          event.inicio = new Date();
          event.compleated_by = user_id
          event.save();
        }


        io.emit('@event:get', {
          id,
          user_id
        });

        return res.status(200).send();
      } catch (error) {
        if ((error as AxiosError)?.isAxiosError) {
          const err = error as AxiosError;
          res.status(err.response?.status || 400).json(err.response?.data);
        } else {
          res.status(500).json({
            type: (error as Error).name,
            msg: (error as Error).message,
          });
        }
      }
    }
  },

  alert_notify(io: Server) {
    return async (req: Request, res: Response) => {
      const url = '/registro/';
      const { VALOR, API } = req.query;
      console.log('query: ', req.query);
      try {
        const response = await api_server.get<AspSucessResponse>(url, { params: req.query });
        const { data: payload } = response;
        if (payload.success) {
          if (Number(VALOR) === 1) {
            const { id, local, piso, type } = await handleCreateEvent({
              banheiro: payload.local,
              box: payload.box,
              local: payload.posicao,
              piso: payload.piso,
              type: 1,
              mac: String(API),
              zone_id: 1,
            } as any);

            console.log('@event:new -', {
              id,
              local,
              piso,
              type,
            });

            io.emit('@event:new', {
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
        if ((error as AxiosError)?.isAxiosError) {
          const err = error as AxiosError;
          console.error(err.response?.data)
          res.status(err.response?.status || 400).json(err.response?.data);
        } else {
          res.status(500).json({
            type: (error as Error).name,
            msg: (error as Error).message,
          });
        }
      }
    };
  },


  push_notification(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const payload = req.body as IPush_Data;
        const zone_id = 0;
        // encodeURI(payload.local_fisico).toLowerCase();

        const { id, local, piso, type } = await handleCreateEvent({
          banheiro: payload.local,
          local: payload.posicao,
          piso: payload.setor,
          type: 3,
          zone_id,
          description: payload.descricao,
          payload: JSON.stringify(payload),
        } as any);
        // console.log(new Date().toISOString(), '@event:new -', zone_id, id);
        const date_array = payload?.dataeventoinicial?.split('/');
        const time =
          payload.timestamp ||
          `${date_array[2]}-${date_array[1]}-${date_array[0]}T${payload.horaevento}.000-03:00`;
        io.emit('@event:new', {
          id,
          local,
          piso,
          type,
          time,
        } as EventFeedItem);

        return res.status(200).send();
      } catch (error) {
        console.error(`${(error as any).name}:`, (error as any).message);
        res.status(500).json({
          type: (error as Error).name || 'UNKNOWN',
          msg: (error as Error).message,
        });
      }
    };
  },
};

export interface IPush_Data {
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
  status: number;
  timestamp: string;
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
        throw new Error(`'${key as string}' is a required field.`);
      }
  }
}
