// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import threadInfoFragment, {
  type ThreadInfoType,
} from 'shared/graphql/fragments/thread/threadInfo';

type Thread = {
  ...$Exact<ThreadInfoType>,
};

export type GetCommunityTopAndNewThreadsType = {
  ...$Exact<CommunityInfoType>,
  topAndNewThreads: {
    topThreads: Array<?Thread>,
    newThreads: Array<?Thread>,
  },
};

export const getCommunityTopAndNewThreadsQuery = gql`
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
