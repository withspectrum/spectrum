// @flow
import { graphql, gql } from 'react-apollo';

const SUBSCRIBE_TO_WEB_PUSH_MUTATION = gql`
  mutation subscribeToWebPush($subscription: WebPushSubscription!) {
    subscribeWebPush(subscription: $subscription)
  }
`;

const SUBSCRIBE_TO_WEB_PUSH_OPTIONS = {
  props: ({ mutate }) => ({
    subscribeToWebPush: subscription => {
      if (!subscription) return;
      const json = subscription.toJSON();
      return mutate({
        variables: {
          subscription: {
            endpoint: json.endpoint,
            keys: {
              p256dh: json.keys.p256dh,
              auth: json.keys.auth,
            },
          },
        },
      });
    },
  }),
};

export const subscribeToWebPush = graphql(
  SUBSCRIBE_TO_WEB_PUSH_MUTATION,
  SUBSCRIBE_TO_WEB_PUSH_OPTIONS
);
