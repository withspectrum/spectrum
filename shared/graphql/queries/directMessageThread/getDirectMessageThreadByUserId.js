// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';

export type GetDirectMessageThreadByUserIdType = {
  ...$Exact<DirectMessageThreadInfoType>,
};

export const getDirectMessageThreadByUserIdQuery = gql`
  query getDirectMessageThreadByUserId($userId: ID!) {
    directMessageThreadByUserId(userId: $userId) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;

export const getDirectMessageThreadByUserIdOptions = {
  options: ({ userId }: { userId: string }) => ({
    variables: {
      userId,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getDirectMessageThreadByUserIdQuery,
  getDirectMessageThreadByUserIdOptions
);
