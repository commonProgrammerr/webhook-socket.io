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
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: '*',
//   },
// });

app.use(express.json());
// app.use('/graphql', )
const port = process.env.PORT || 3030;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}/`)
);
