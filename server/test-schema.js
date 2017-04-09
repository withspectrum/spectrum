const { makeExecutableSchema } = require('graphql-tools');
const { getAllPosts } = require('./models/post');

const typeDefs = /* GraphQL */ `
	type Post {
		id: ID!
		content: String
	}

	type Query {
		posts: [Post]
	}

	type Mutation {
		editPost(id: ID!, content: String!): Post
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;

let posts = [
  {
    id: '1',
    content: 'abc',
  },
  {
    id: '2',
    content: 'def',
  },
];

const resolvers = {
  Query: {
    posts: getAllPosts,
  },
  Mutation: {
    editPost(_, { id, content }) {
      const post = posts.find(post => post.id === id);
      if (!post) throw new Error(`No post with ID ${id} found.`);

      posts = posts.map(post => {
        if (post.id !== id) return post;

        return Object.assign({}, post, {
          content,
        });
      });

      return Object.assign({}, post, {
        content,
      });
    },
  },
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
