//@flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
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
        channelConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              ...channelInfo
            }
          }
        }
      }
		}
    ${channelInfoFragment}
    ${communityInfoFragment}
	`
);

export const getChannel = graphql(
  gql`
		query channel($id: ID!) {
			channel(id: $id) {
        ...channelInfo
        community {
          ...communityInfo
        }
        metaData {
          members
        }
      }
    }
    ${channelInfoFragment}
    ${communityInfoFragment}
	`,
  {
    options: ({ id }) => ({
      variables: {
        id,
      },
    }),
    props: ({
      data: { fetchMore, error, loading, channel },
      ownProps: { ids },
    }) => ({
      data: {
        error,
        loading,
        channel,
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

export const getTopChannels = graphql(
  gql`
		{
		  topChannels {
        ...channelInfo
        community {
          ...communityInfo
        }
        metaData {
          members
        }
      }
    }
    ${channelInfoFragment}
    ${communityInfoFragment}
	`,
  {
    props: ({ data: { error, loading, topChannels } }) => ({
      data: {
        error,
        loading,
        topChannels,
      },
    }),
  }
);
