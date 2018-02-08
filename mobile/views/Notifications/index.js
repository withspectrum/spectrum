// @flow
import React from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
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

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  data: {
    notifications: GetNotificationsType,
  },
};

type State = {
  subscription: ?Function,
};

class Notifications extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      subscription: null,
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    this.subscribe();
  }

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
    if (notifications) {
      return (
        <Wrapper>
          <View>
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

export default compose(withSafeView, getNotifications, viewNetworkHandler)(
  Notifications
);
