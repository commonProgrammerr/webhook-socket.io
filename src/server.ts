import express, { Request } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import './database/connection';

import Event, { EventType, Status } from './models/Event';
import EventsController from './controllers/event';

import { LessThanOrEqual, Raw } from 'typeorm';
import Grupo from './models/Grupo';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
app.use(express.json());

const port = process.env.PORT || 3030;

io.on('connection', async (socket) => {
  console.log(socket.id, ' chegou');
  socket.on('disconnect', () => console.log(socket.id, ' leave...'));
  socket.on('loging', (user) => {
  })
  // socket.on('acept', async (data) => {
  //   const { id, user } = data;
  //   const event = await Event.findOne({ where: { id } });
  //   if (event) {
  //     event.inicio = new Date();
  //     event.compleated_by = user
  //     event.save();
  //   }
  // })
});

async function hanleSendScheduledEvents<T extends typeof io>(io: T) {

  const offset_time = new Date();
  offset_time.setMinutes(offset_time.getMinutes() + 15);


  const eventos = await Event.find({
    where: {
      enable: true,
      inicio: null,
      status: Raw((alias) => `${alias} <> :status`, { status: Status.ENVIADO }),
      type: EventType.PEVENTIVO,
      data_agendamento: LessThanOrEqual(offset_time.toISOString())
    },
    relations: ['grupo']
  });

  eventos.forEach((ev) => {
    const grupe = ev.grupo?.nome

    const message = {
      id: ev.id,
      local: ev.local,
      piso: ev.piso,
      type: ev.type,
      time: ev.data_agendamento,
    }
    const server_namespace = grupe && `/${encodeURI(grupe)}`;

    io.of(server_namespace || '/').emit('@event:new', message);

    ev.status = Status.ENVIADO;
    Event.save(ev).then(() => console.log('event:', ev.id, 'send to', server_namespace || '/'));
  });
}

app.post('/events/send_report', EventsController.close_event(io));
app.post('/events/feed', EventsController.feed);
app.post('/events/search', EventsController.search);
app.post('/events/suport', EventsController.suport_event(io));

app.get('/', EventsController.alert_notify(io));
app.post('/acept', EventsController.acept(io));



httpServer.listen(port, () =>
  console.log(`Server running at http://localhost:${port}/`)
);

let timeout: NodeJS.Timeout;
function handleTimeout() {
  timeout = setTimeout(() => {
    hanleSendScheduledEvents(io)
      .then(() => handleTimeout())
      .catch((err) => {
        console.error(err);
        timeout && clearTimeout(timeout);
      });
  }, 1000);
}

handleTimeout();
