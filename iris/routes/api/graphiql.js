// @flow
import { graphiqlExpress } from 'graphql-server-express';

export default graphiqlExpress({
  endpointURL: '/api',
  subscriptionsEndpoint: `ws://localhost:3001/websocket`,
  query: `{\n  user(id: "58a023a4-912d-48fe-a61c-eec7274f7699") {\n    name\n    username\n    communities {\n      name\n      frequencies {\n        name\n        stories {\n          content {\n            title\n          }\n          messages {\n            message {\n              content\n            }\n          }\n        }\n      }\n    }\n  }\n}`,
});
