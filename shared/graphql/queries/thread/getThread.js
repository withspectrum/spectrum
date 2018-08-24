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
  options: (props: {
    threadId?: string,
    match?: { params: { threadId: string, '0'?: string, '1'?: string } },
  }) =>
    console.log(props) || {
      variables: {
        id: props.threadId
          ? props.threadId
          : props.match
            ? // the .params[1] case kicks in with our new custom thread slugs, which use
              // a custom regexp to match /some-custom-slug-asdf-123-123-123-asdf
              props.match.params.threadId || props.match.params[1]
            : null,
      },
      fetchPolicy: 'cache-first',
    },
};

export const getThreadByMatch = graphql(
  getThreadByMatchQuery,
  getThreadByMatchOptions
);
