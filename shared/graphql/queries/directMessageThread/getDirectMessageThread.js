// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';

export type GetDirectMessageThreadType = {
  ...$Exact<DirectMessageThreadInfoType>,
};

export const getDirectMessageThreadQuery = gql`
  query getDirectMessageThread($id: ID!) {
    directMessageThread(id: $id) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;

export const getDirectMessageThreadOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getDirectMessageThreadQuery,
  getDirectMessageThreadOptions
);
