// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

type Node = {
  node: {
    ...$Exact<ThreadInfoType>,
  },
};

export type SearchThreadsType = {
  searchResultsConnection: {
    edges: Array<?Node>,
  },
};

const searchThreadsQuery = gql`
  query searchThreads(
    $queryString: String!
    $type: SearchType!
    $filter: SearchFilter
  ) {
    search(queryString: $queryString, type: $type, filter: $filter) {
      searchResultsConnection {
        edges {
          node {
            ... on Thread {
              ...threadInfo
            }
          }
        }
      }
    }
  }
  ${threadInfoFragment}
`;

const searchThreadsOptions = {
  props: ({ data: { error, loading, search, networkStatus } }) => ({
    data: {
      error,
      loading,
      networkStatus,
      fetchMore: () => {},
      threads: search ? search.searchResultsConnection.edges : [],
      threadConnection: search && search.searchResultsConnection,
    },
  }),
  options: ({ queryString, filter }) => ({
    variables: {
      queryString,
      filter,
      type: 'THREADS',
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(searchThreadsQuery, searchThreadsOptions);
