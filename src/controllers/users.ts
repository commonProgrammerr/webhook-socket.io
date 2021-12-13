import { uuid } from 'uuidv4'
import { Request, Response } from 'express'

export default {
  auth(req: Request, res: Response) {
    const {
      usr_log,
      usr_pass
    } = req.body

    console.log(`login try... login: ${usr_log}, password: ${usr_pass}`)

    if (usr_log === 'admin' && usr_pass === 'admin')
      return res.status(200).json({
        usr_id: uuid(),
        usr_grupo: uuid(),
        usr_name: "Administrador",
        usr_ph: undefined,
      })
    else
      return res.status(400).json(null)
  }
}