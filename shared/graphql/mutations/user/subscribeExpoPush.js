// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export const subscribeExpoPushMutation = gql`
  mutation subscribeExpoPush($token: String!) {
    subscribeExpoPush(token: $token)
  }
`;

const subscribeExpoPushOptions = {
  props: ({ mutate }) => ({
    subscribeExpoPush: (token: string) =>
      mutate({
        variables: {
          token,
        },
      }),
  }),
};

export default graphql(subscribeExpoPushMutation, subscribeExpoPushOptions);
