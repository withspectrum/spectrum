// @flow
import { Engine } from 'apollo-engine';

export default new Engine({
  graphqlPort: 3001,
  endpoint: '/api',
  engineConfig: {
    logging: {
      level: 'WARN',
    },
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
});
