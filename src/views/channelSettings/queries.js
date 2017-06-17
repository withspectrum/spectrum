import { graphql, gql } from 'react-apollo';
import { channelInfoFragment } from '../../api/fragments/channel/channelInfo';
import {
  channelMetaDataFragment,
} from '../../api/fragments/channel/channelMetaData';

export const getThisChannel = graphql(
  gql`
    query thisChannel($channelSlug: String, $communitySlug: String) {
			channel(channelSlug: $channelSlug, communitySlug: $communitySlug) {
        ...channelInfo
        ...channelMetaData
      }
		}
    ${channelInfoFragment}
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
