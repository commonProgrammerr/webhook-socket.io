import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import controler from './controllers/alerts';
import AlertView from './views/alert_view';
import './database/connection';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const port = process.env.PORT || 3030;

const conn = io.on('connection', async (socket) => console.log('connected:', socket.id))
app.post('/', async (req, res) => {
  const {
    mac,
    status
  } = req.query

  const alert = await controler.save({
    alert_status: Number(status),
    device_mac: String(mac)
  })

  if (Number(status) !== 0) {
    conn.emit('alert', mac, status, alert.created_at)
    io.emit('alert', mac, status, alert.created_at)
  }

  res.json(AlertView.render(alert))
});

app.get('/', controler.index)


// io.on('connection', async (socket) => {
//   const result = await controler.find({
//     order: {
//       alert_status: 'ASC'
//     },
//     where: [
//       { alert_status: 1, updated_at: new Date().getDate() },
//       { alert_status: 3 },
//     ],
//     select: ['device_mac', 'alert_status', 'updated_at'],
//   })

//   result.forEach(alert => io.emit(
//     'alert',
//     alert.device_mac,
//     alert.alert_status,
//     alert.updated_at
//   ))
// });



httpServer.listen(port, () => console.log(`Server running at http://localhost:${port}/`));
