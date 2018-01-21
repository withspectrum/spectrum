// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';

const getCommunityMemberGrowthQuery = gql`
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
