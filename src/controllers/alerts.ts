import { Server } from 'socket.io'
import { Request, Response } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';

import Alert from '../models/Alert'
import AlertView from '../views/alert_view'

export default {
  async index(_req: Request, res: Response) {
    const alertRepository = getRepository(Alert);

    const alerts = await alertRepository.find();

    return res.json(AlertView.renderMany(alerts));
  },

  async save(data: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) {
    const alertRepository = getRepository(Alert);

    const alert = alertRepository.create({ ...data });

    return alertRepository.save(alert);
  },

  async find(op: FindOneOptions<Alert>) {
    const alertRepository = getRepository(Alert);

    return alertRepository.find(op)
  },

  alert(io: Server) {
    return async (req: Request, res: Response) => {
      const {
        mac,
        status
      } = req.query
    
      const alert = await this.save({
        alert_status: Number(status),
        device_mac: String(mac)
      })
    
    
      io.emit('alert', {
        id: mac,
        status: Number(status),
        date: alert.created_at.toLocaleDateString(),
        time: alert.created_at.toLocaleTimeString()
      })
    
      res.json(AlertView.render(alert))
    }
  }
};