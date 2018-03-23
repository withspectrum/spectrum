// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type EnableBrandedLoginType = {
  data: boolean,
};

export const importSlackMembersMutation = gql`
  mutation importSlackMembers($input: ImportSlackMembersInput!) {
    importSlackMembers(input: $input)
  }
`;

const importSlackMembersOptions = {
  props: ({ mutate }) => ({
    importSlackMembers: (input: { id: string }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(importSlackMembersMutation, importSlackMembersOptions);
