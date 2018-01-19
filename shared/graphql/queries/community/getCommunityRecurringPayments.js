// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';

const getCommunityRecurringPaymentsQuery = gql`
  query getCommunityRecurringPayments($id: ID!) {
    community(id: $id) {
      ...communityInfo
      recurringPayments {
        plan
        amount
        createdAt
        status
      }
    }
  }
  ${communityInfoFragment}
`;

const getCommunityRecurringPaymentsOptions = {
  options: ({ id }: { id: string }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(
  getCommunityRecurringPaymentsQuery,
  getCommunityRecurringPaymentsOptions
);
