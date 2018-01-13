import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { communityInfoFragment } from '../../fragments/community/communityInfo';
import { communityMetaDataFragment } from '../../fragments/community/communityMetaData';

export const getCommunityByIdQuery = gql`
  query getCommunity($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(getCommunityByIdQuery, getCommunityByIdOptions);
