import { graphql, gql } from 'react-apollo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  channelMetaDataFragment,
} from '../../api/fragments/channel/channelMetaData';

export const getThisChannel = graphql(
  gql`
    query thisChannel($slug: String, $community: String) {
			channel(slug: $slug, community: $community) {
        ...channelInfo
        pendingUsers {
          ...userInfo
        }
        blockedUsers {
          ...userInfo
        }
        ...channelMetaData
        community {
          ...communityInfo
        }
      }
		}
    ${channelInfoFragment}
    ${userInfoFragment}
    ${communityInfoFragment}
    ${channelMetaDataFragment}
	`,
  {
    options: ({ match }) => ({
      variables: {
        slug: match.params.channelSlug,
        community: match.params.communitySlug,
      },
    }),
  }
);
