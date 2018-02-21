// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from '../../fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';

export type MakeDefaultPaymentSourceType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
    },
  },
};

type MakeDefaultPaymentSourceInput = {
  sourceId: string,
  communityId: string,
};

export const makeDefaultPaymentSourceMutation = gql`
  mutation makeDefaultPaymentSource($input: MakeDefaultPaymentSourceInput!) {
    makeDefaultPaymentSource(input: $input) {
      ...communityInfo
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
`;

const makeDefaultPaymentSourceOptions = {
  props: ({ mutate }) => ({
    makeDefaultPaymentSource: (input: MakeDefaultPaymentSourceInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  makeDefaultPaymentSourceMutation,
  makeDefaultPaymentSourceOptions
);
