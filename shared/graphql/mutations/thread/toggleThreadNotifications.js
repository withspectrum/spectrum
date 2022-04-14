// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type ToggleThreadNotificationsType = {
  id: string,
  receiveNotifications: boolean,
};

export const toggleThreadNotificationsMutation = gql`
  mutation toggleThreadNotifications($threadId: ID!) {
    toggleThreadNotifications(threadId: $threadId) {
      id
      receiveNotifications
    }
  }
`;

const toggleThreadNotificationsOptions = {
  props: ({ mutate }) => ({
    toggleThreadNotifications: ({ threadId }: { threadId: string }) =>
      mutate({
        variables: {
          threadId,
        },
      }),
  }),
};

export default graphql(
  toggleThreadNotificationsMutation,
  toggleThreadNotificationsOptions
);
