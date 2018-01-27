// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

type Growth = {
  growth: number,
  currentPeriodCount: number,
  prevPeriodCount: number,
};

export type GetCommunityMemberGrowthType = {
  ...$Exact<CommunityInfoType>,
  memberGrowth: {
    count: number,
    weeklyGrowth: Growth,
    monthlyGrowth: Growth,
    quarterlyGrowth: Growth,
  },
};

export const getCommunityMemberGrowthQuery = gql`
  query getCommunityMemberGrowth($id: ID) {
    community(id: $id) {
      ...communityInfo
      memberGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
    }
  }
  ${communityInfoFragment}
`;

const getCommunityMemerGrowthOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityMemberGrowthQuery,
  getCommunityMemerGrowthOptions
);
