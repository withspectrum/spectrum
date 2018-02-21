// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from '../../fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';

export type AddPaymentSourceType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
    },
  },
};

type AddPaymentSourceInput = {
  sourceId: string,
  communityId: string,
};

export const addPaymentSourceMutation = gql`
  mutation addPaymentSource($input: AddPaymentSourceInput!) {
    addPaymentSource(input: $input) {
      ...communityInfo
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
`;

const addPaymentSourceOptions = {
  props: ({ mutate }) => ({
    addPaymentSource: (input: AddPaymentSourceInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(addPaymentSourceMutation, addPaymentSourceOptions);
