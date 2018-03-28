// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from '../../fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';

export type RemovePaymentSourceType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
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
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
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
