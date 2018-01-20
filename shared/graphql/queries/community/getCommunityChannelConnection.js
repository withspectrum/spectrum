// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';

const getCommunityChannelConnectionQuery = gql`
  query getCommunityChannels($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communityChannelConnection
    }
  }
  ${communityInfoFragment}
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
