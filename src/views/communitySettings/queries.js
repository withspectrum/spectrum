import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from '../../api/fragments/community/communityInfo';
import { communityMetaDataFragment } from '../../api/fragments/community/communityMetaData';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import { channelMetaDataFragment } from '../../api/fragments/channel/channelMetaData';

export const getThisCommunity = graphql(
  gql`
    query thisCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
        ...communityMetaData
        recurringPayments {
          plan
          amount
          createdAt
          status
        }
      }
		}
    ${communityInfoFragment}
    ${communityMetaDataFragment}
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
            ...channelMetaData
          }
        }
      }
    }
  }
  ${channelInfoFragment}
  ${communityInfoFragment}
  ${channelMetaDataFragment}
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
