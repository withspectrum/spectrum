//@flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';

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
              ...communityInfo
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
              ...frequencyInfo
            }
          }
        }
      }
		}
    ${frequencyInfoFragment}
    ${communityInfoFragment}
	`
);

export const getFrequency = graphql(
  gql`
		query frequency($id: ID!) {
			frequency(id: $id) {
        ...frequencyInfo
        community {
          ...communityInfo
        }
        metaData {
          subscribers
        }
      }
    }
    ${frequencyInfoFragment}
    ${communityInfoFragment}
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
        ...communityInfo
        metaData {
          members
        }
      }
    }
    ${communityInfoFragment}
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
        ...frequencyInfo
        community {
          ...communityInfo
        }
        metaData {
          subscribers
        }
      }
    }
    ${frequencyInfoFragment}
    ${communityInfoFragment}
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
