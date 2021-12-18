import express, { Request } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import './database/connection'



import EventsController from './controllers/event'

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

io.on('connection', async (socket) => {
  console.log(socket.id, ' chegou')
  socket.on('disconnect', () => console.log(socket.id, ' leave...'))
})
console.log(process.env.DATABASE_URL)

app.post('/events/new', EventsController.push_event(io))
app.post('/events/close', EventsController.close_event(io))
app.post('/events/feed', EventsController.feed)
app.post('/events/search', EventsController.search)

app.get('/', async (req, res) => {
  
})
app.post('/auth', UsersController.auth)

httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
