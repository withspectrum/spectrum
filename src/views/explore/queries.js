import { graphql, gql } from 'react-apollo';

const queryOptions = {
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
      fuckboi: frequency ? frequency : '',
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
      }
    }
	`,
  queryOptions
);

const queryOptionsForTopThirty = {
  props: ({ data: { fetchMore, error, loading, frequencies } }) => ({
    data: {
      error,
      loading,
      frequencies,
    },
  }),
};

export const getTopThirtyFrequencies = graphql(
  gql`
		{
		  topThirtyFrequencies {
        id
        name
        slug
      }
    }
	`,
  queryOptionsForTopThirty
);
