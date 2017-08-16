// @flow
import { graphql, gql } from 'react-apollo';

const SUBSCRIBE_TO_WEB_PUSH_MUTATION = gql`
  mutation subscribeToWebPush($subscription: WebPushSubscription!) {
    subscribeWebPush(subscription: $subscription)
  }
`;

const SUBSCRIBE_TO_WEB_PUSH_OPTIONS = {
  props: ({ mutate }) => ({
    subscribeToWebPush: subscription =>
      mutate({
        variables: {
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.getKey('p256dh'),
              auth: subscription.getKey('auth'),
            },
          },
        },
      }),
  }),
};

export const subscribeToWebPush = graphql(
  SUBSCRIBE_TO_WEB_PUSH_MUTATION,
  SUBSCRIBE_TO_WEB_PUSH_OPTIONS
);
