// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type EnableBrandedLoginType = {
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

export const enableBrandedLoginMutation = gql`
  mutation enableBrandedLogin($input: EnableBrandedLoginInput!) {
    enableBrandedLogin(input: $input) {
      id
      slug
      brandedLogin {
        isEnabled
        message
      }
    }
  }
`;

const enableBrandedLoginOptions = {
  props: ({ mutate }) => ({
    enableBrandedLogin: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(enableBrandedLoginMutation, enableBrandedLoginOptions);
