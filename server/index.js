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
  }),
);
app.use('/', bodyParser.json(), graphqlExpress({ schema }));

init({ host: 'localhost', port: 28015 }).then(() => {
  app.listen(PORT);
  console.log('GraphQL server running on port', PORT);
});
