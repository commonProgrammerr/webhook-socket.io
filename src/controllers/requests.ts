import assert, { AssertionError } from 'assert';
import { Server } from 'socket.io'
import { Request, Response } from 'express';

let feed = [] as Array<{
  [key: string]: any
}>

const reports = [] as Array<{
  oc_id: string,
  usr_id: string,
  tool: string,
  type: string,
  type_obs?: string
}>

export default {
  push(io: Server) {
    return async (req: Request, res: Response) => {
      try {
        const {
          id,
          zone_id,
          box,
          local,
          piso,
          type
        } = req.body
        console.log('new request ', id)

        assert(id, `Invalid body! Missing the 'id' field.`)
        assert(zone_id, `Invalid body! Missing the 'zone_id' field.`)
        assert(box, `Invalid body! Missing the 'box' field.`)
        assert(local, `Invalid body! Missing the 'local' field.`)
        assert(piso, `Invalid body! Missing the 'piso' field.`)
        assert(type, `Invalid body! Missing the 'type' field.`)

        assert(
          io.emit('update-feed:new_request', {
            id,
            box,
            local,
            piso,
            type
          }),
          new Error('Socket connection fail!')
        )
        feed.push(req.body)
        return res.status(201).send()

      } catch (error) {
        if (error instanceof AssertionError) {
          return res.status(400).json({
            code: 'Missing Field',
            message: error.message
          })
        } else {
          return res.status(500).json({
            code: (error as Error)?.name,
            message: (error as Error)?.message
          })
        }
      }
    }
  },

  feed_controller: async (req: Request, res: Response) => {
    return res.status(200).json({
      feed
    })
  },

  find: async (req: Request, res: Response) => {
    const { oc_id } = req.body
    return res.status(200).json(feed.find(item => item?.id === oc_id))
  },

  report(io: Server) {
    return async (req: Request, res: Response) => {
      const { oc_id, usr_id, tool, type, type_obs } = req.body

      try {
        feed = feed.filter(item => item.id !== oc_id)
        reports.push({ oc_id, usr_id, tool, type, type_obs })
        assert(
          io.emit('update-feed:remove', {
            id: oc_id,
          }),
          new Error('Socket connection fail!')
        )
        return res.status(200).json({
          usr_id,
          oc_id
        })
      } catch (error) {
        if (error instanceof AssertionError) {
          return res.status(400).json({
            code: 'Missing Field',
            message: error.message
          })
        } else {
          return res.status(500).json({
            code: (error as Error)?.name,
            message: (error as Error)?.message
          })
        }
      }
    }
  }


};