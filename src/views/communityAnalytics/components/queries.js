import { graphql, gql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import channelMetaDataFragment from 'shared/graphql/fragments/channel/channelMetaData';

export const getThisCommunity = graphql(
  gql`
    query thisCommunity($slug: String) {
      community(slug: $slug) {
        ...communityInfo
        recurringPayments {
          plan
          amount
          createdAt
          status
        }
      }
    }
    ${communityInfoFragment}
  `,
  {
    options: props => ({
      variables: {
        slug: props.match.params.communitySlug.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }
);

export const GET_COMMUNITY_CHANNELS_QUERY = gql`
  query getCommunityChannels($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      channelConnection {
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
`;

export const GET_COMMUNITY_CHANNELS_OPTIONS = {
  options: ({ communitySlug }: { communitySlug: string }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityChannels = graphql(
  GET_COMMUNITY_CHANNELS_QUERY,
  GET_COMMUNITY_CHANNELS_OPTIONS
);
