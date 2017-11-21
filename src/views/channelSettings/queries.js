import { graphql, gql } from 'react-apollo';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import { communityInfoFragment } from '../../api/fragments/community/communityInfo';
import { channelMetaDataFragment } from '../../api/fragments/channel/channelMetaData';

export const getThisChannel = graphql(
  gql`
    query thisChannel($channelSlug: String, $communitySlug: String) {
			channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
        ...channelInfo
        community {
          ...communityInfo
        }
        ...channelMetaData
      }
		}
    ${channelInfoFragment}
    ${communityInfoFragment}
    ${channelMetaDataFragment}
	`,
  {
    options: ({ match }) => ({
      variables: {
        channelSlug: match.params.channelSlug.toLowerCase(),
        communitySlug: match.params.communitySlug.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }
);
