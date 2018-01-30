// @flow
import { Engine } from 'apollo-engine';

// In development don't send any perf data
const origins =
  process.env.NODE_ENV === 'development'
    ? {
        maxConcurrentRequests: 0,
      }
    : undefined;

export default new Engine({
  graphqlPort: 3001,
  endpoint: '/api',
  engineConfig: {
    stores: [
      {
        name: 'pq',
        inMemory: {
          cacheSize: '5000000',
        },
      },
    ],
    persistedQueries: {
      store: 'pq',
    },
    logging: {
      level: 'WARN',
    },
    apiKey: process.env.APOLLO_ENGINE_API_KEY,
  },
  origins,
});
