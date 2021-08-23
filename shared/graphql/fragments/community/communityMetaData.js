// @flow
import gql from 'graphql-tag';

export type CommunityMetaDataType = {
  metaData: {
    members: number,
  },
};

export default gql`
  fragment communityMetaData on Community {
    metaData {
      members
    }
  }
`;
