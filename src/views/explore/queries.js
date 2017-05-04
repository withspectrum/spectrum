//@flow
import { graphql, gql } from 'react-apollo';

export const getUserSubscriptions = graphql(
  gql`
    query userSubscriptions{
			user: currentUser {
        communityConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
            }
          }
        }
        frequencyConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
            }
          }
        }
      }
		}
	`
);

export const getFrequency = graphql(
  gql`
		query frequency($id: ID!) {
			frequency(id: $id) {
        id
        name
        slug
        community {
          id
          name
          slug
        }
        description
        metaData {
          subscribers
        }
      }
    }
	`,
  {
    options: ({ id }) => ({
      variables: {
        id,
      },
    }),
    props: ({
      data: { fetchMore, error, loading, frequency },
      ownProps: { ids },
    }) => ({
      data: {
        error,
        loading,
        frequency,
        ids,
      },
    }),
  }
);

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
  {
    options: ({ id }) => ({
      variables: {
        id,
      },
    }),
    props: ({
      data: { fetchMore, error, loading, community },
      ownProps: { ids },
    }) => ({
      data: {
        error,
        loading,
        community,
        ids,
      },
    }),
  }
);

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
  {
    props: ({ data: { error, loading, topFrequencies } }) => ({
      data: {
        error,
        loading,
        topFrequencies,
      },
    }),
  }
);
