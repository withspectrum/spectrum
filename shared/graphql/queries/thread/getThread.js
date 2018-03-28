// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type GetThreadType = {
  ...$Exact<ThreadInfoType>,
};

export const getThreadByIdQuery = gql`
  query getThreadById($id: ID!) {
    thread(id: $id) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const getThreadByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getThreadById = graphql(getThreadByIdQuery, getThreadByIdOptions);

export const getThreadByMatchQuery = gql`
  query getThreadByMatch($id: ID!) {
    thread(id: $id) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

export const getThreadByMatchOptions = {
  options: ({
    threadId,
    match,
  }: {
    threadId?: string,
    match?: { params: { threadId: string } },
  }) => ({
    variables: {
      id: threadId
        ? threadId
        : match
          ? match.params.threadId
          : console.error('bad arg supplied to getThreadByMatch') || null,
    },
    fetchPolicy: 'cache-first',
  }),
};

export const getThreadByMatch = graphql(
  getThreadByMatchQuery,
  getThreadByMatchOptions
);
