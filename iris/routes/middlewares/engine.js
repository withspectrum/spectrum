// @flow
import { Engine } from 'apollo-engine';

const engine = new Engine({
  engineConfig: {
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
    sessionAuth: {
      cookie: 'connect.sid',
    },
    logging: {
      level: 'ERROR',
    },
  },
  graphqlPort: 3001,
  endpoint: '/api',
});

console.log('Apollo Engine started, proxying requests to the GraphQL API');
engine.start();

export default engine.expressMiddleware();
