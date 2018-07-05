// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import threadInfoFragment, {
  type ThreadInfoType,
} from 'shared/graphql/fragments/thread/threadInfo';
import communitySettingsFragment, {
  type CommunitySettingsType,
} from 'shared/graphql/fragments/community/communitySettings';

type Thread = {
  ...$Exact<ThreadInfoType>,
};

export type GetCommunityTopAndNewThreadsType = {
  ...$Exact<CommunityInfoType>,
  ...$Exact<CommunitySettingsType>,
  topAndNewThreads: {
    topThreads: Array<?Thread>,
    newThreads: Array<?Thread>,
  },
};

export const getCommunityTopAndNewThreadsQuery = gql`
  query getCommunityTopAndNewThreads($id: ID) {
    community(id: $id) {
      ...communityInfo
      ...communitySettings
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
  ${communitySettingsFragment}
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
