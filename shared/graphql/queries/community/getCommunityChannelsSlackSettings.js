// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionWithSlackSettingsFragment, {
  type CommunityChannelConnectionWithSlackSettingsType,
} from '../../fragments/community/communityChannelConnectionWithSlackSettings';

type SlackChannel = {
  id: string,
  name: string,
};

export type GetCommunityChannelsSlackSettings = {
  ...$Exact<CommunityInfoType>,
  slackSettings: {
    slackChannelList: Array<SlackChannel>,
  },
  ...$Exact<CommunityChannelConnectionWithSlackSettingsType>,
};

export const getCommunityChannelConnectionSlackSettingsQuery = gql`
  query getCommunityChannelsWithSlackSettings($id: ID) {
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

const getCommunityChannelConnectionSlackSettingsOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityChannelConnectionSlackSettingsQuery,
  getCommunityChannelConnectionSlackSettingsOptions
);
