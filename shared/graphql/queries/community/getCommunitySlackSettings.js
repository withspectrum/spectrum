// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type GetSlackSettingsType = {
  ...$Exact<CommunityInfoType>,
  slackSettings: {
    teamName: string,
    isConnected: boolean,
    hasSentInvites: boolean,
    memberCount: number,
    invitesSentAt: number,
  },
};

export const getSlackSettingsQuery = gql`
  query getSlackSettings($id: ID!) {
    community(id: $id) {
      ...communityInfo
      slackSettings {
        teamName
        isConnected
        hasSentInvites
        memberCount
        invitesSentAt
      }
    }
  }
  ${communityInfoFragment}
`;

const getSlackSettingsOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(getSlackSettingsQuery, getSlackSettingsOptions);
