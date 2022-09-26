import { Server } from 'socket.io';
import { Request, Response } from 'express';
import Event from '../models/Event';
import View, { EventFeedItem } from '../views/events_view';
import axios, { AxiosError } from 'axios';
import User from '../models/User';

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

const api_server = axios.create({
  baseURL: 'http://miimo.a4rsolucoes.com.br/apis', // online,
  // baseURL: 'http://192.168.15.86:83/apis', // casa
  // baseURL: 'http://192.168.230.221:81/apis', // 4G
});

// async function handleCreateEvent(data: NewEvent) {
//   try {
//     const repository = getRepository(Event);
//     return await repository.manager.transaction(async manager => {

//       let newEvent = Event.create<Event>({
//         ...data,
//         enable: true,
//       });
//       const errors = await validate(newEvent);

//       if (errors.length > 0) {
//         throw new Error(`Validation failed! Wrong field.`);
//       } else {
//         let agenda = Agenda.create<Agenda>({
//           cod_grupo_resp: newEvent.zone_id,
//           finalizado_em: newEvent.fim,
//           execucao_em: newEvent.inicio,
//           dataeventoinicial: new Date().toDateString(),
//           dataeventofinal: new Date().toDateString(),
//           DESCRICAO: newEvent.description,
//           cod_dispositivo: newEvent.mac,
//           cod_usu_solicitante: newEvent.request_by,
//           status: newEvent.status,
//           horaevento: newEvent.data_agendamento?.toTimeString()
//         })
//         await manager.save(agenda);
//         return await manager.save(newEvent);
//       }
//     })

//   } catch (err) {
//     throw err
//   }
// }

// async function handleCloseEvent(id: string, ev?: Event) {
//   const repository = getRepository(Event);
//   const a = ev || (await repository.findOne({ where: { id } }));
//   const payload = a?.payload && JSON.parse(a?.payload);

//   if (a?.type === 3) {
//     if (!payload) {
//       throw new Error('Invalid Event type');
//     }
//     console.log(payload);
//     const resp = await api_server.post('/agenda/atualiza/', {
//       codigo: payload['codigo'],
//       status: 1,
//     });

//     console.log(resp.status);
//   }

//   return await repository.update(id, {
//     enable: false,
//   });
// }

export default {
  suport_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        // const original = await Event.findOneOrFail(req.body.id)

        // let suport_event = original.clone({
        //   request_by: req.body.user_id,
        //   apoio_de: req.body.id,
        //   id_agendamanutencao: req.body.id,
        //   enable: true,
        //   type: 2,
        // });

        const suport_event = await api_server.post('suporte/', {
          id: req.body.id,
          user_id: req.body.user_id,
          description: req.body.description,
        });

        const { id, local, piso, type, request_by } = suport_event.data;

        const requisitor = await User.findOne(request_by);

        console.log('@event:suport', local);
        io.emit('@event:new', {
          id,
          local,
          piso,
          type,
          request_by: requisitor?.nome,
        });

        return res.status(201).send();
      } catch (error) {
        const err = error as AxiosError;
        if (err.isAxiosError) {
          return res
            .status(err.response?.status ?? 500)
            .json(err.response?.data);
        } else {
          return res.status(500).json({
            code: 'Internal Error',
            msg: (error as Error).message,
          });
        }
      }
    };
  },
  close_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const { id, report } = req.body;
        console.log(req.body);
        const event = await Event.findOne(id);
        delete report.type_obs;
        await api_server.post('/report/', {
          ...report,
          id_agendamanutencao: event?.id_agendamanutencao,
        });
        if (event) {
          console.log(event);
          event.fim = new Date();
          // console.log('save:', await event.save());
          io.emit('@event:close', {
            id: event.id,
          } as EventFeedItem);
        }
        return res.status(200).send();
      } catch (error) {
        if ((error as AxiosError)?.isAxiosError) {
          const err = error as AxiosError;
          console.error(err.response?.data);
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
      relations: ['requestBy'],
    });

    if (!result) {
      return res.status(404).json({
        msg: 'Inexistent or invalid ID entity',
      });
    }

    return res.status(200).json(View.render(result));
  },

  async feed(req: Request, res: Response) {
    try {
      const { page, user_id } = req.body;

      if (page <= 0 || !user_id) {
        return res.status(400).json({
          msg: 'Invalid page',
        });
      }

      const page_size = 5;
      const offset = ((page ?? 1) - 1) * page_size;

      const result = await Event.find({
        where: [
          { enable: true },
          { enable: false, compleated_by: user_id, fim: null },
        ],
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: (error as Error).name,
        msg: (error as Error).message,
      });
    }
  },

  acept(io: Server) {
    return async (req: Request, res: Response) => {
      const { id, user_id } = req.body;
      try {
        const event = await Event.findOneOrFail(id);
        // if (event?.type === 1) {
        //   await api_server.get('registro/', {
        //     params: {
        //       VALOR: 3,
        //       API: event.mac,
        //     },
        //   });
        // }
        event.enable = false;
        event.inicio = new Date();
        event.compleated_by = user_id;
        await event.save();

        io.emit('@event:get', {
          id,
          user_id,
        });

        return res.status(200).send();
      } catch (error) {
        if ((error as AxiosError)?.isAxiosError) {
          const err = error as AxiosError;
          console.log(err.response?.data);
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

  alert_notify(io: Server) {
    return async (req: Request, res: Response) => {
      const url = '/registro/';
      const { VALOR, API } = req.query;
      console.log('query: ', req.query);
      try {
        const response = await api_server.get<AspSucessResponse>(url, {
          params: req.query,
        });
        const { data: payload } = response;
        if (payload.success) {
          if (Number(VALOR) === 1) {
            const {
              id,
              local: banheiro,
              box: box,
              posicao: local,
              piso: piso,
            } = payload;

            console.log('@event:new -', {
              id,
              local,
              piso,
              type: 1,
            });

            io.emit('@event:new', {
              id,
              local,
              piso,
              type: 1,
            });
          }
          res.status(200).send();
        } else {
          res.status(400).json(response);
        }
      } catch (error) {
        if ((error as AxiosError)?.isAxiosError) {
          const err = error as AxiosError;
          console.error(err.response?.data);
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
};
