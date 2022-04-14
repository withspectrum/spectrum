// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type SaveBrandedLoginSettingsType = {
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

export const saveBrandedLoginSettingsMutation = gql`
  mutation saveBrandedLoginSettings($input: SaveBrandedLoginSettingsInput!) {
    saveBrandedLoginSettings(input: $input) {
      id
      slug
      brandedLogin {
        isEnabled
        message
      }
    }
  }
`;

const saveBrandedLoginSettingsOptions = {
  props: ({ mutate }) => ({
    saveBrandedLoginSettings: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  saveBrandedLoginSettingsMutation,
  saveBrandedLoginSettingsOptions
);
