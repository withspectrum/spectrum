// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMetaDataFragment from '../../fragments/community/communityMetaData';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';

const getCommunityChannelConnectionQuery = gql`
  query getCommunityChannels($id: ID) {
    community(id: $id) {
      id
      ...communityChannelConnection
    }
  }
  ${communityChannelConnectionFragment}
`;

const getCommunityChannelConnectionOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityChannelConnectionQuery,
  getCommunityChannelConnectionOptions
);
