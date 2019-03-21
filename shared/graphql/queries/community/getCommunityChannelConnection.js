// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityChannelConnectionFragment from '../../fragments/community/communityChannelConnection';
import type { CommunityChannelConnectionType } from '../../fragments/community/communityChannelConnection';

export type GetCommunityChannelConnectionType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunityChannelConnectionType>,
};

export const getCommunityChannelConnectionQuery = gql`
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
    fetchPolicy: 'cache-first',
  }),
};

export default graphql(
  getCommunityChannelConnectionQuery,
  getCommunityChannelConnectionOptions
);
