// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';

const getCommunityConversationGrowthQuery = gql`
  query getCommunityConversationGrowth($id: ID) {
    community(id: $id) {
      ...communityInfo
      conversationGrowth {
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

const getCommunityConversationGrowthOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getCommunityConversationGrowthQuery,
  getCommunityConversationGrowthOptions
);
