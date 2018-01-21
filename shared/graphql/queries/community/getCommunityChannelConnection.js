// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';
import type { CommunityChannelConnectionType } from '../../fragments/community/communityChannelConnection';

export type GetCommunityType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityChannelConnectionType>,
};

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
