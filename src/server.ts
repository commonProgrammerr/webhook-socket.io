import express, { Request } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import RequestController from './controllers/requests'

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
app.use(express.json());

const port = process.env.PORT || 3030;

const feed = []

io.on('connection', async (socket) => {
  console.log(socket.id, ' chegou')
  socket.on('disconnect', () => console.log(socket.id, ' leave...'))
})

app.post('/request/create', RequestController.push(io))
app.post('/feed/', RequestController.feed_controller)
app.post('/search/', RequestController.find)
app.post('/report', RequestController.report(io))
app.post('/suport_request', RequestController.find)

app.post('/auth', (req, res) => {
  const {
    usr_log,
    usr_pass
  } = req.body

  // if (usr_log === 'admin' && usr_pass === 'admin')
    return res.status(200).json({
      usr_id: "1",
      usr_name: "Administrador",
      usr_ph: undefined,
      usr_grupo: "Administrador",
      usr_status: "Ativo"
    })
  // else 
  //   return res.status(400).json(null)
})

httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
