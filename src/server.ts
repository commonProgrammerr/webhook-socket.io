import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// import AlertsController from './controllers/alerts';
// import AlertView from './views/alert_view';

import RequestController from './controllers/requests'
import './database/connection';

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

// app.post('/alert', AlertsController.alert(io));

// app.get('/alerts', AlertsController.index)

app.get('/feed', RequestController.feed)
app.post('/request/create', RequestController.pop(io))
app.get('/request', RequestController.find)



httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
