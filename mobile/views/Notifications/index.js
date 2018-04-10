// @flow
import React from 'react';
import { View, Button } from 'react-native';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { SecureStore } from 'expo';
import Text from '../../components/Text';
import InfiniteList from '../../components/InfiniteList';
import withSafeView from '../../components/SafeAreaView';
import { Wrapper } from '../Splash/style';
import getNotifications, {
  type GetNotificationsType,
} from '../../../shared/graphql/queries/notification/getNotifications';
import viewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import subscribeExpoPush from '../../../shared/graphql/mutations/user/subscribeExpoPush';
import getPushNotificationToken from '../../utils/get-push-notification-token';
import type { State as ReduxState } from '../../reducers';
import type { AuthenticationState } from '../../reducers/authentication';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  mutate: (token: any) => Promise<any>,
  authentication: AuthenticationState,
  data: {
    subscribeToNewNotifications: Function,
    fetchMore: Function,
    refetch: Function,
    notifications: GetNotificationsType,
  },
};

type PushNotificationsDecision = {
  decision?: boolean,
  timestamp?: Date,
};

type State = {
  subscription: ?Function,
  pushNotifications: ?PushNotificationsDecision,
};

const mapStateToProps = (state: ReduxState): * => ({
  authentication: state.authentication,
});

class Notifications extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      subscription: null,
      pushNotifications: null,
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    if (this.props.authentication.token) this.subscribe();
    SecureStore.getItemAsync('pushNotificationsDecision').then(data => {
      if (!data) {
        this.setState({
          pushNotifications: {},
        });
        return;
      }

      try {
        const json: PushNotificationsDecision = JSON.parse(data);
        this.setState({
          pushNotifications: json,
        });
      } catch (err) {}
    });
  }

  componentDidUpdate(prev) {
    const curr = this.props;
    if (
      prev.authentication.token !== curr.authentication.token &&
      curr.authentication.token
    ) {
      this.subscribe();
    }
  }

  enablePushNotifications = async () => {
    const token = await getPushNotificationToken();
    let data;
    if (!token) {
      data = { decision: false, timestamp: new Date() };
    } else {
      data = { decision: true, timestamp: new Date() };
      this.props.mutate(token);
    }
    this.setState({
      pushNotifications: data,
    });
    SecureStore.setItemAsync('pushNotificationsDecision', JSON.stringify(data));
  };

  subscribe = () => {
    this.setState({
      subscription:
        this.props.data.subscribeToNewNotifications &&
        this.props.data.subscribeToNewNotifications(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  fetchMore = () => {
    const {
      isFetchingMore,
      isLoading,
      hasError,
      isRefetching,
      data: { fetchMore, notifications },
    } = this.props;
    if (!isFetchingMore && !isLoading && !hasError && !isRefetching) {
      fetchMore();
    }
  };

  render() {
    const { isLoading, hasError, data: { notifications } } = this.props;
    const { pushNotifications } = this.state;
    if (notifications) {
      return (
        <Wrapper>
          <View>
            {pushNotifications != null &&
              pushNotifications.decision === undefined && (
                <Button
                  title="Enable push notifications"
                  onPress={this.enablePushNotifications}
                />
              )}
            <InfiniteList
              data={notifications.edges}
              renderItem={({ item: { node } }) => (
                <Text type="body">{node.id}</Text>
              )}
              loadingIndicator={<Text>Loading...</Text>}
              hasNextPage={notifications.pageInfo.hasNextPage}
              fetchMore={this.fetchMore}
              refetching={this.props.isRefetching}
              refetch={this.props.data.refetch}
            />
          </View>
        </Wrapper>
      );
    }

    if (isLoading)
      return (
        <Wrapper>
          <Text type="body">Loading...</Text>
        </Wrapper>
      );

    if (hasError)
      return (
        <Wrapper>
          <Text type="body">Oh crap, error</Text>
        </Wrapper>
      );

    return null;
  }
}

export default compose(
  withSafeView,
  getNotifications,
  subscribeExpoPush,
  viewNetworkHandler,
  connect(mapStateToProps)
)(Notifications);
