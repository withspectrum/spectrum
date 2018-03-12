// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type DisableBrandedLoginType = {
  data: {
    community: {
      id: string,
      slug: string,
      brandedLogin: {
        isEnabled: boolean,
        customMessage: ?string,
      },
    },
  },
};

export const disableBrandedLoginMutation = gql`
  mutation disableBrandedLogin($input: DisableBrandedLoginInput!) {
    disableBrandedLogin(input: $input) {
      id
      slug
      brandedLogin {
        isEnabled
        customMessage
      }
    }
  }
`;

const disableBrandedLoginOptions = {
  props: ({ mutate }) => ({
    disableBrandedLogin: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(disableBrandedLoginMutation, disableBrandedLoginOptions);
