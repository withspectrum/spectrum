// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';

export type GetDirectMessageThreadByUserIdsType = {
  ...$Exact<DirectMessageThreadInfoType>,
};

export const getDirectMessageThreadByUserIdsQuery = gql`
  query getDirectMessageThreadByUserIds($userIds: [ID!]) {
    directMessageThreadByUserIds(userIds: $userIds) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;

export const getDirectMessageThreadByUserIdsOptions = {
  options: ({ userIds }: { userIds: Array<string> }) => ({
    variables: {
      userIds,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getDirectMessageThreadByUserIdsQuery,
  getDirectMessageThreadByUserIdsOptions
);
