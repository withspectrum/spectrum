// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionWithSlackSettingsFragment, {
  type CommunityChannelConnectionWithSlackSettingsType,
} from '../../fragments/community/communityChannelConnectionWithSlackSettings';

export type GetCommunityChannelsSlackSettings = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityChannelConnectionWithSlackSettingsType>,
};

export const getCommunityChannelConnectionQuery = gql`
  query getCommunityChannels($id: ID) {
    community(id: $id) {
      ...communityInfo
      slackSettings {
        slackChannelList {
          id
          name
        }
      }
      ...communityChannelConnectionWithSlackSettings
    }
  }
  ${communityInfoFragment}
  ${communityChannelConnectionWithSlackSettingsFragment}
`;

const getCommunityChannelConnectionOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityChannelConnectionQuery,
  getCommunityChannelConnectionOptions
);
