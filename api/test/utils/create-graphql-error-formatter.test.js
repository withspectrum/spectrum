// @flow

const debug = require('debug')('api:utils:error-formatter');

import { graphql, print } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import createErrorFormatter from '../../utils/create-graphql-error-formatter';

const typeDefs = `
	type Community {
		id: ID!
    threadConnection(first: Int = 10, after: String): CommunityThreadsConnection!
	}

	type CommunityThreadsConnection {
		edges: [CommunityThreadEdge!]
	}

	type CommunityThreadEdge {
		node: Thread!
	}

	type Thread {
		id: ID!
		channel: Channel!
	}

	type Channel {
		id: ID!
	}

	type Query {
		community(id: ID): Community
	}
`;

const resolvers = {
  Query: {
    community: () => ({ id: 1 }),
  },
  Community: {
    threadConnection: () => ({}),
  },
  CommunityThreadsConnection: {
    edges: () => [6],
  },
  CommunityThreadEdge: {
    node: id => ({ id }),
  },
  Thread: {
    channel: () => null,
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const query = `
    query getCommunityThreadConnection( $id: ID ){
      community( id: $id ) {
        id
        threadConnection {
          edges {
            node {
              id
              channel {
                id
              }
            }
          }
        }
      }
    }
    `;

const variables = { id: 1 };

describe('createGraphQLErrorFormatter', () => {
  const stderrWrite = process.stderr.write;

  afterEach(() => {
    process.stderr.write = stderrWrite;
  });

  it('returns function', () => {
    expect(createErrorFormatter()).toBeInstanceOf(Function);
  });

  it('logs error path', async () => {
    debug.log = [];

    const result = await graphql(schema, query, null, null, variables);
    const formatter = createErrorFormatter();
    (result.errors || []).forEach(formatter);
    expect(debug.log).toMatchSnapshot();
  });

  it('logs query and variables', async () => {
    debug.log = [];

    const result = await graphql(schema, query, null, null, variables);
    const formatter = createErrorFormatter({ body: { query, variables } });
    (result.errors || []).forEach(formatter);
    expect(debug.log).toMatchSnapshot();
  });
});
