import gql from 'graphql-tag';

export const communityMetaDataFragment = gql`
  fragment communityMetaData on Community {
    metaData {
      channels
      members
    }
  }
`;
