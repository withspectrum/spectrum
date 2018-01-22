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

export type UpgradeCommunityType = {
  ...$Exact<CommunityInfoType>,
  recurringPayments: Array<?RP>,
};

type UpgradeInput = {
  plan: string,
  token: string,
  communityId: string,
};

const upgradeCommunityMutation = gql`
  mutation upgradeCommunity($input: UpgradeCommunityInput!) {
    upgradeCommunity(input: $input) {
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

const upgradeCommunityOptions = {
  props: ({ input, mutate }) => ({
    upgradeCommunity: (input: UpgradeInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(upgradeCommunityMutation, upgradeCommunityOptions);
