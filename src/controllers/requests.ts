import assert from 'node:assert';
import { Server } from 'socket.io'
import { Request, Response } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';

import RequestModel from '../models/Request'
import RequestView from '../views/requests_view'
import { RequestsTypes } from './../models/Request'


export async function handleCreate(data: Omit<RequestModel, 'id' | 'created_at' | 'updated_at'>) {
  console.log("Criando novo request");
  console.log(data)
  const requestRepository = getRepository(RequestModel);

  const request = requestRepository.create({ ...data });

  return requestRepository.save(request);
}

export default {
  async index(_req: Request, res: Response) {
    const requestRepository = getRepository(RequestModel);

    const requests = await requestRepository.find();

    return res.json(RequestView.renderMany(requests));
  },

  async find(req: Request, res: Response) {
    const id = String(req.query.id)

    console.log('search for ', { id })
    try {
      const requestRepository = getRepository(RequestModel);

      const request_entity = await requestRepository.findOneOrFail({
        where: { id }
      })

      if (!request_entity)
        return res.status(404).json({
          message: "Inexistent entity"
        })

      return res.status(200).json(request_entity)
    } catch (error) {
      return res.status(500).json({
        error: (error as Error)?.name,
        message: (error as Error)?.message
      })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const created_response = await handleCreate(req.body)

      return res.status(201).json(created_response)

    } catch (error) {
      return res.status(400).json({
        error: (error as Error)?.name,
        message: (error as Error)?.message
      })
    }
  },

  async feed(req: Request, res: Response) {
    const page = Number(req.query.page)
    const per_page = 5
    const offset = (page ? Number(page) - 1 : 0) * per_page
    console.log({
      page,
      offset
    })

    const requestRepository = getRepository(RequestModel);

    const requests = await requestRepository.find({
      select: ['id', 'local', 'box', 'piso', 'type'],
      order: {
        created_at: 'DESC'
      },
      skip: offset,
      take: per_page,
      where: [
        { type: RequestsTypes.AJUDA },
        { type: RequestsTypes.ENTUPIMENTO }
      ]
    });

    return res.json(RequestView.feed(requests));
  },

  pop(io: Server) {
    return async (req: Request, res: Response) => {
      console.log('new request')
      try {
        const new_occurrence = await handleCreate(req.body)
        const {
          id,
          box,
          local,
          piso,
          type
        } = new_occurrence

        assert(
          io.emit('update-feed:new_request', {
            id,
            box,
            local,
            piso,
            type
          }),
          'Socket connection fail!'
        )

        return res.status(201).json(new_occurrence)

      } catch (error) {
        return res.status(400).json({
          error: (error as Error)?.name,
          message: (error as Error)?.message
        })
      }
    }
  }
};