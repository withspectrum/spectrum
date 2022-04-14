// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

type BanUserInput = {
  userId: string,
  reason: string,
};

export const banUserMutation = gql`
  mutation banUser($input: BanUserInput!) {
    banUser(input: $input)
  }
`;

const banUserOptions = {
  props: ({ mutate }) => ({
    banUser: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(banUserMutation, banUserOptions);
