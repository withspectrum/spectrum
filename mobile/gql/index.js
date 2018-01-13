// @flow
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const IS_PROD = process.env.NODE_ENV === 'production';
const API_URI = IS_PROD ? '/api' : 'http://localhost:3001/api';

const client = new ApolloClient({
  link: new HttpLink({ uri: API_URI }),
  cache: new InMemoryCache(),
});

export default client;
