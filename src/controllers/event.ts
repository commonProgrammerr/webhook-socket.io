import { getRepository } from 'typeorm'
import { Server } from 'socket.io';
import { Request, Response } from 'express';
import Event from '../models/Event'
import View, { EventFeedItem } from '../views/events_view';


type NewEvent = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'enable'>

async function handleCreateEvent(data: NewEvent) {
  const repository = getRepository(Event)
  const newEvent = repository.create({ ...data, enable: true })
  return repository.save(newEvent)
}

async function handleCloseEvent(id: string) {
  const repository = getRepository(Event)
  return await repository.update(id, {
    enable: false
  })
}

export default {
  push_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        
        const {
          id,
          local,
          piso,
          type
        } = await handleCreateEvent(req.body)
        console.log("@event:new -", req.body.zone_id)
        io.path(req.body.zone_id).emit("@event:new", {
          id,
          local,
          piso,
          type
        } as EventFeedItem)
        
        return res.status(201).send()
      } catch (error) {
        return res.status(500).json({
          code: 'Internal Error',
          msg: (error as Error).message
        })
      }
    }
  },
  close_event(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        
        const { id, zone_id } = req.body
        await handleCloseEvent(id)
        io.path(zone_id).emit("@event:close", {
          id,
        } as EventFeedItem)

        return res.status(200).send()
      } catch (error) {
        return res.status(500).json({
          code: 'Internal Error',
          msg: (error as Error).message
        })
      }
    }
  },
  
  async search(req: Request, res: Response) {
    const { id, zone_id } = req.body
    
    const repository = getRepository(Event)
    const result = await repository.findOne({
      where: { id }
    })
    
    if (!result)
    return res.status(404).json({
      msg: "Inexistent or invalid ID entity"
    })
    
    return res.status(200).json(View.render(result))
  },
  
  async feed(req: Request, res: Response) {
    const { page, zone_id } = req.body
    const page_size = 5
    const offset = (page * page_size) - page_size
    
    const repository = getRepository(Event)
    const result = await repository.find({
      where: { zone_id, enable: true },
      order: {
        created_at: 'DESC'
      }
    })
    
    return res.status(200).json({
      page: 1,
      feed: View.feed(result)
    })
  },


}