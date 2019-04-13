// @flow
import gql from 'graphql-tag';

export type CommunitySettingsType = {
  joinSettings: {
    tokenJoinEnabled: boolean,
    token: string,
  },
};

export default gql`
  fragment communitySettings on Community {
    joinSettings {
      tokenJoinEnabled
      token
    }
  }
`;
