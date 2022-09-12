import 'reflect-metadata';
import express, { Request } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import './database/connection';
import EventsController from './controllers/event';
import { buildSchema } from 'type-graphql';
import path from 'path';
import { graphqlHTTP } from 'express-graphql';
import { createComplexityRule, fieldExtensionsEstimator, simpleEstimator } from 'graphql-query-complexity';
import { GraphQLError } from 'graphql';
import Evento, { StatusEvento, TipoEvento } from './models/Evento';
import { LessThanOrEqual } from 'typeorm';

const app = express();
async function appConfig() {
  const schema = await buildSchema({
    resolvers: [path.resolve('src/resolvers/*.ts')],
    nullableByDefault: true,
    emitSchemaFile: true,
  });
  app.use('/graphql', graphqlHTTP((req, res, params) => ({
    schema,
    graphiql: true,
    validationRules: [
      createComplexityRule({
        maximumComplexity: 20,
        estimators: [
          fieldExtensionsEstimator(),
          simpleEstimator({
            defaultComplexity: 1
          })
        ],
        variables: {
          ...params?.variables,
        },
        onComplete(complexity) {
          console.log('Determined query complexity: ', complexity);
        },
        createError(max, actual) {
          return new GraphQLError(
            `Query is too complex: ${actual}. Maximum allowed complexity: ${max}`
          );
        },
      }),
    ],
  })))

  return app;
}

appConfig()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
// app.use('/graphql', )
const port = process.env.PORT || 3030;


io.on('connection', async (socket) => {
  console.log(socket.id, ' chegou');
  socket.on('disconnect', () => console.log(socket.id, ' leave...'));

  socket.on('acept', async (data) => {
    const { id, user } = data;
    const event = await Evento.findOne({ where: { id } });
    if (event) {
      event.inicio = new Date();
      event.usuarioId = user
      event.save();
    }

  })
});

console.log(process.env.DATABASE_URL);
async function hanleSendReports<T extends typeof io>(io: T) {

  const offset_time = new Date();
  offset_time.setMinutes(offset_time.getMinutes() + 15);


  const eventos = await Evento.find({
    where: {
      enable: true,
      tipo: TipoEvento.PEVENTIVO,
      inicio: null,
      status: StatusEvento.AGENDADO,
      data_agendamento: LessThanOrEqual(offset_time.toISOString())
    },
  });

  eventos.forEach((evento) => {
    io.emit('@event:new', {
      id: evento.id,
      local: evento.local,
      piso: evento.piso,
      type: evento.tipo,
      time: evento.data_agendamento,
    });
    evento.status = Status.ENVIADO;
    Evento.save(evento).then(() => console.log(evento.id, ' enviado'));
  });
}

httpServer.listen(port, () =>
  console.log(`Server running at http://localhost:${port}/`)
);

let timeout: NodeJS.Timeout;
function handleTimeout() {
  timeout = setTimeout(() => {
    hanleSendReports(io)
      .then(() => handleTimeout())
      .catch((err) => {
        console.error(err);
        timeout && clearTimeout(timeout);
      });
  }, 1000);
}

handleTimeout();
