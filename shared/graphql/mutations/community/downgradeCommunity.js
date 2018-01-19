// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';

type DowngradeInput = {
  id: string,
};

const downgradeCommunityMutation = gql`
  mutation downgradeCommunity($input: DowngradeCommunityInput!) {
    downgradeCommunity(input: $input) {
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

const downgradeCommunityOptions = {
  props: ({ input, mutate }) => ({
    downgradeCommunity: (input: DowngradeInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(downgradeCommunityMutation, downgradeCommunityOptions);
