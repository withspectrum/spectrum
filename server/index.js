const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { init } = require('./models/db');

const schema = require('./schema');

const PORT = 3001;
const app = express();

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/',
    query: `query getCommunity($id: ID!) {\n  community(id: $id) {\n    name\n    frequencies {\n      name\n      stories {\n        content {\n          title\n          description\n          media\n        }\n      }\n    }\n  }\n}`,
    variables: { id: 'spectrum-staging' },
  }),
);
app.use('/', bodyParser.json(), graphqlExpress({ schema }));

init({ host: 'localhost', port: 28015 }).then(() => {
  app.listen(PORT);
  console.log('GraphQL server running on port', PORT);
});
