import { graphql, gql } from 'react-apollo';

const queryOptionsForGetFrequency = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props: ({ data: { fetchMore, error, loading, frequency } }) => ({
    data: {
      error,
      loading,
      frequency,
    },
  }),
};

export const getFrequency = graphql(
  gql`
		query frequency($id: ID!) {
			frequency(id: $id) {
        id
        name
        slug
        community {
          name
        }
        description
        metaData {
          subscribers
        }
      }
    }
	`,
  queryOptionsForGetFrequency
);

const queryOptionsForGetCommunity = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props: ({ data: { fetchMore, error, loading, community } }) => ({
    data: {
      error,
      loading,
      community,
    },
  }),
};

export const getCommunity = graphql(
  gql`
		query community($id: ID!) {
			community(id: $id) {
        id
        name
        slug
        metaData {
          members
        }
      }
    }
	`,
  queryOptionsForGetCommunity
);

const queryOptionsForTopFrequencies = {
  props: ({ data: { error, loading, topFrequencies } }) => ({
    data: {
      error,
      loading,
      topFrequencies,
    },
  }),
};

export const getTopFrequencies = graphql(
  gql`
		{
		  topFrequencies {
        id
        name
        slug
        community {
          name
        }
        description
        metaData {
          subscribers
        }
      }
    }
	`,
  queryOptionsForTopFrequencies
);
