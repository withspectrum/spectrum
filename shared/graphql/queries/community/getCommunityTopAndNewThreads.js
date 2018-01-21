// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import threadInfoFragment from 'shared/graphql/fragments/thread/threadInfo';

const getCommunityTopAndNewThreadsQuery = gql`
  query getCommunityTopAndNewThreads($id: ID) {
    community(id: $id) {
      ...communityInfo
      topAndNewThreads {
        topThreads {
          ...threadInfo
        }
        newThreads {
          ...threadInfo
        }
      }
    }
  }
  ${communityInfoFragment}
  ${threadInfoFragment}
`;

const getCommunityTopAndNewTheradsOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityTopAndNewThreadsQuery,
  getCommunityTopAndNewTheradsOptions
);
