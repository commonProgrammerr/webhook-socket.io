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
  }
};