// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communityBillingSettingsFragment from '../../fragments/community/communityBillingSettings';
import type { CommunityBillingSettingsType } from '../../fragments/community/communityBillingSettings';

export type RemovePaymentSourceType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunityBillingSettingsType>,
    },
  },
};

type RemovePaymentSourceInput = {
  sourceId: string,
  communityId: string,
};

export const removePaymentSourceMutation = gql`
  mutation removePaymentSource($input: RemovePaymentSourceInput!) {
    removePaymentSource(input: $input) {
      ...communityInfo
      ...communityBillingSettings
    }
  }
  ${communityInfoFragment}
  ${communityBillingSettingsFragment}
`;

const removePaymentSourceOptions = {
  props: ({ mutate }) => ({
    removePaymentSource: (input: RemovePaymentSourceInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(removePaymentSourceMutation, removePaymentSourceOptions);
