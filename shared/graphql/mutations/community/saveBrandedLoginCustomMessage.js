// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type SaveBrandedLoginCustomMessageType = {
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

export const saveBrandedLoginCustomMessageMutation = gql`
  mutation saveBrandedLoginCustomMessage(
    $input: SaveBrandedLoginCustomMessageInput!
  ) {
    saveBrandedLoginCustomMessage(input: $input) {
      id
      slug
      brandedLogin {
        isEnabled
        customMessage
      }
    }
  }
`;

const saveBrandedLoginCustomMessageOptions = {
  props: ({ mutate }) => ({
    saveBrandedLoginCustomMessage: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  saveBrandedLoginCustomMessageMutation,
  saveBrandedLoginCustomMessageOptions
);
