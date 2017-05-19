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
    query thisChannel($channelSlug: String, $communitySlug: String) {
			channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
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
        channelSlug: match.params.channelSlug,
        communitySlug: match.params.communitySlug,
      },
    }),
  }
);
