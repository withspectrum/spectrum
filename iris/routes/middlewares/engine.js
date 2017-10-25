// @flow
import { Engine } from 'apollo-engine';

const engine = new Engine({
  engineConfig: {
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
  graphqlPort: 3001,
  endpoint: '/api',
});

engine.start();

export default engine.expressMiddleware();
