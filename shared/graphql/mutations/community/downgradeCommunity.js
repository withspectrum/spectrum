// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

type RP = {
  plan: string,
  amount: number,
  createdAt: Date,
  status: string,
};

export type DowngradeCommunityType = {
  data: {
    downgradeCommunity: {
      ...$Exact<CommunityInfoType>,
      recurringPayments: Array<?RP>,
    },
  },
};

type DowngradeInput = {
  id: string,
};

export const downgradeCommunityMutation = gql`
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
  props: ({ mutate }) => ({
    downgradeCommunity: (input: DowngradeInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(downgradeCommunityMutation, downgradeCommunityOptions);
