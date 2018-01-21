// @flow
import gql from 'graphql-tag';

export type CommunityMetaDataType = {
  metaData: {
    channels: number,
    members: number,
  },
};

export default gql`
  fragment communityMetaData on Community {
    metaData {
      channels
      members
    }
  }
`;
