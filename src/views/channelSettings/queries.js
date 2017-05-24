import { graphql, gql } from 'react-apollo';
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
        ...channelMetaData
        pendingUsers {
          ...userInfo
        }
        blockedUsers {
          ...userInfo
        }
      }
		}
    ${channelInfoFragment}
    ${channelMetaDataFragment}
    ${userInfoFragment}
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
