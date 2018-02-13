// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type UpdateAdministratorEmailType = {
  data: {
    updateAdministratorEmail: {
      ...$Exact<CommunityInfoType>,
      billingSettings: {
        administratorEmail: ?string,
        stripeCustomerId: ?string,
        pendingAdministratorEmail: ?string,
      },
    },
  },
};

export const updateAdministratorEmailMutation = gql`
  mutation updateAdministratorEmail($input: UpdateAdministratorEmailInput!) {
    updateAdministratorEmail(input: $input) {
      ...communityInfo
      billingSettings {
        administratorEmail
        stripeCustomerId
        pendingAdministratorEmail
      }
    }
  }
  ${communityInfoFragment}
`;

const updateAdministratorEmailOptions = {
  props: ({ mutate }) => ({
    updateAdministratorEmail: ({
      input,
    }: {
      input: { id: string, email: string },
    }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  updateAdministratorEmailMutation,
  updateAdministratorEmailOptions
);
