// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityBillingSettingsFragment from '../../fragments/community/communityBillingSettings';
import type { CommunityBillingSettingsType } from '../../fragments/community/communityBillingSettings';

export type AddPaymentSourceType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityBillingSettingsType>,
    },
  },
};

type AddPaymentSourceInput = {
  sourceId: string,
  communityId: string,
};

export const addPaymentSourceMutation = gql`
  mutation makeDefaultPayment($input: addPaymentSourceInput!) {
    makeDefaultPayment(input: $input) {
      ...communityInfo
      ...communityBillingInfo
    }
  }
  ${communityInfoFragment}
  ${communityBillingSettingsFragment}
`;

const addPaymentSourceOptions = {
  props: ({ mutate }) => ({
    makeDefaultPayment: (input: AddPaymentSourceInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(addPaymentSourceMutation, addPaymentSourceOptions);
