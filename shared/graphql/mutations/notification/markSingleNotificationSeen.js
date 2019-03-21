// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const markSingleNotificationSeenMutation = gql`
  mutation markSingleNotificationSeen($id: ID!) {
    markSingleNotificationSeen(id: $id)
  }
`;

const markSingleNotificationSeenOptions = {
  props: ({ mutate }: { mutate: Function }) => ({
    markSingleNotificationSeen: (id: string) =>
      mutate({
        variables: {
          id,
        },
      }),
  }),
};

export default graphql(
  markSingleNotificationSeenMutation,
  markSingleNotificationSeenOptions
);
