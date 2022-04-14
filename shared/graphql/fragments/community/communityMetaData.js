// @flow
import gql from 'graphql-tag';

export type CommunityMetaDataType = {
  metaData: {
    members: number,
    onlineMembers: number,
  },
};

export default gql`
  fragment communityMetaData on Community {
    metaData {
      members
      onlineMembers
    }
  }
`;
