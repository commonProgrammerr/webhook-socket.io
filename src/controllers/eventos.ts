import express from 'express';
import Evento from '../models/Evento';
import { getRepository } from 'typeorm';

const events_routs = express.Router();
const repository = getRepository(Evento);
const page_size = 5;

events_routs.get('/feed/:id/:page', async (req, res) => {
  const { id, page } = req.params;
  const offset = (Number(page) - 1) * page_size;
  let events = await repository.find({
    where: {
      enable: true,
      usuario: {
        id,
      },
    },

    order: {
      created_at: 'DESC',
    },
    skip: offset,
    take: page_size,
  });
});

events_routs.post('/create/', async (req, res) => {

})
