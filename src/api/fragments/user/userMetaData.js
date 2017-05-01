import { gql } from 'react-apollo';

export const userMetaDataFragment = gql`
  fragment userMetaData on User {
    stories
  }
`;
