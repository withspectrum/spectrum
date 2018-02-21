// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';
import communitySettingsFragment from '../../fragments/community/communitySettings';
import type { CommunitySettingsType } from '../../fragments/community/communitySettings';

export type MakePaymentSourceDefaultType = {
  data: {
    MakeDefaultSource: {
      ...$Exact<CommunityInfoType>,
      ...$Exact<CommunitySettingsType>,
    },
  },
};

type MakePaymentSourceDefaultInput = {
  sourceId: string,
  communityId: string,
};

export const makePaymentSourceDefaultMutation = gql`
  mutation makePaymentSourceDefault($input: MakePaymentSourceDefaultInput!) {
    makePaymentSourceDefault(input: $input) {
      ...communityInfo
      ...communitySettings
    }
  }
  ${communityInfoFragment}
  ${communitySettingsFragment}
`;

const makePaymentSourceDefaultOptions = {
  props: ({ mutate }) => ({
    makePaymentSourceDefault: (input: MakePaymentSourceDefaultInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  makePaymentSourceDefaultMutation,
  makePaymentSourceDefaultOptions
);
