// @flow
import gql from 'graphql-tag';

export default gql`
  fragment communityMetaData on Community {
    metaData {
      channels
      members
    }
  }
`;
