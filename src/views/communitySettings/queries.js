import { graphql, gql } from 'react-apollo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import {
  channelMetaDataFragment,
} from '../../api/fragments/channel/channelMetaData';

export const getThisCommunity = graphql(
  gql`
    query thisCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
      }
		}
    ${communityInfoFragment}
	`,
  {
    options: props => ({
      variables: {
        slug: props.match.params.communitySlug,
      },
    }),
  }
);

export const getChannelsByCommunity = graphql(
  gql`
    query channelsByCommunity($slug: String) {
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
    ${communityInfoFragment}
    ${channelInfoFragment}
    ${channelMetaDataFragment}
	`
);
