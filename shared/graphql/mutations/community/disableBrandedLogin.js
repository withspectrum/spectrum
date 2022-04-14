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
        message: ?string,
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
        message
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
