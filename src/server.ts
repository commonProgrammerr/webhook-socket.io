import express, { Request } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import RequestController from './controllers/requests'
import UsersController from './controllers/users'

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

app.post('/requests/create', RequestController.push(io))
app.post('/requests/feed', RequestController.feed_controller)
app.post('/requests/search', RequestController.find)
app.post('/requests/report', RequestController.report(io))
app.post('/requests/suport', RequestController.require_suport(io))
app.post('/auth', UsersController.auth)

httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
