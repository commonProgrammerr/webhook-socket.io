import express from 'express'
import Usuario from '../models/Usuario'
import { getRepository } from 'typeorm'

const user_routs = express.Router()
const repository = getRepository(Usuario);

user_routs.get('/login', async (req, res) => {
  const { login, password } = req.body
  let user = await repository.findOneOrFail({
    relations: ['eventos', 'grupo'],
    where: {
      email: login,
      senha: password,
    }
  })

  if (user) {
    delete user.senha
    res.status(200).json(user)
  }
})


