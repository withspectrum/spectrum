// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import Head from '../../../components/head';
import { NotificationDropdown } from './notificationDropdown';
import {
  getNotifications,
  markNotificationsSeenMutation,
  MARK_SINGLE_NOTIFICATION_SEEN_MUTATION,
} from '../../../api/notification';
import { IconLink, IconDrop, Label } from '../style';
import { getDistinctNotifications } from '../../notifications/utils';

type Props = {
  active: boolean,
  currentUser: Object,
  isLoading: boolean,
  hasError: boolean,
  isFetchingMore: boolean,
  isRefetching: boolean,
  data: {
    notifications?: {
      edges: Array<any>,
    },
    subscribeToNewNotifications: Function,
  },
  refetch: Function,
};

type State = {
  count: number,
  subscription: ?Function,
};

class NotificationsTab extends React.Component<Props, State> {
  state = {
    count: 0,
    subscription: null,
  };

  setCount(props) {
    const { data: { notifications } } = props;
    const rawNotifications = this.processNotifications(notifications);
    console.log(rawNotifications);

    // set to 0 if no notifications exist yet
    if (!rawNotifications || rawNotifications.length === 0) {
      return this.setState({
        count: 0,
      });
    }

    // bundle dm notifications
    const obj = {};
    rawNotifications.filter(n => !n.isSeen).map(o => {
      if (obj[o.context.id]) return;
      obj[o.context.id] = o;
    });

    // count of unique notifications determined by the thread id
    const count = Object.keys(obj).length;

    return this.setState({
      count,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const prevProps = this.props;
    const prevState = this.state;

    // if a refetch completes
    if (
      prevProps.data.networkStatus === 4 &&
      nextProps.data.networkStatus === 7
    )
      return true;

    // once the initial query finishes loading
    if (!prevProps.data.notifications && nextProps.data.notifications)
      return true;

    // if a subscription updates the number of records returned
    if (
      prevProps.data &&
      prevProps.data.notifications &&
      prevProps.data.notifications.edges &&
      nextProps.data.notifications &&
      nextProps.data.notifications.edges &&
      prevProps.data.notifications.edges.length !==
        nextProps.data.notifications.edges.length
    )
      return true;

    // if the user clicks on the messages tab
    if (prevProps.active !== nextProps.active) return true;

    // any time the count changes
    if (prevState.count !== nextState.count) return true;
    return false;
  }

  componentDidUpdate(prevProps) {
    const { data: prevData } = prevProps;
    const { data: thisData, active } = this.props;
    const { subscription } = this.state;

    // never update the badge if the user is viewing the messages tab
    // set the count to 0 if the tab is active so that if a user loads
    // /messages view directly, the badge won't update
    if (active) {
      return this.setState({
        count: 0,
      });
    }

    // if the component updates for the first time
    if (!prevData.notifications && thisData.notifications && !subscription) {
      return this.setCount(this.props);
    }

    // if the component updates with changed or new dm notifications
    // if any are unseen, set the counts
    if (
      thisData.notifications &&
      thisData.notifications.edges &&
      thisData.notifications.edges.length > 0 &&
      thisData.notifications.edges.some(n => !n.isSeen)
    ) {
      return this.setCount(this.props);
    }
  }

  markAllAsSeen = () => {
    const { count } = this.state;

    // don't perform a mutation is there are no unread notifs
    if (count === 0) return;

    // otherwise
    this.props
      .markDirectMessageNotificationsSeen()
      .then(({ data: { markAllUserDirectMessageNotificationsRead } }) => {
        // notifs were marked as seen
        this.props.refetch();
      })
      .catch(err => {
        // err
      });
  };

  componentDidMount() {
    console.log('SUBSCRIBING');
    return this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    this.setState({
      subscription: this.props.data.subscribeToNewNotifications(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  processNotifications = notifications => {
    if (
      !notifications ||
      !notifications.edges ||
      notifications.edges.length === 0
    )
      return [];
    return getDistinctNotifications(notifications.edges.map(n => n.node));
  };

  render() {
    const { active, currentUser, data: { notifications } } = this.props;
    const { count } = this.state;
    const rawNotifications = this.processNotifications(notifications);

    console.log('NOTIFICATIONS TAB PROPS', this.props);
    console.log('NOTIFICATIONS TAB STATE', this.state);

    return (
      <IconDrop
        onMouseEnter={this.markAllNotificationsSeen}
        onClick={this.markAllNotificationsSeen}
      >
        <Head>
          {count > 0 ? (
            <link
              rel="shortcut icon"
              id="dynamic-favicon"
              href={`${process.env.PUBLIC_URL}/img/favicon_unread.ico`}
            />
          ) : (
            <link
              rel="shortcut icon"
              id="dynamic-favicon"
              href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
            />
          )}
        </Head>

        <IconLink data-active={active} to="/notifications" rel="nofollow">
          <Icon
            glyph={count > 0 ? 'notification-fill' : 'notification'}
            withCount={count > 10 ? '10+' : count > 0 ? count : false}
          />
          <Label hideOnDesktop>Notifications</Label>
        </IconLink>

        <NotificationDropdown
          rawNotifications={rawNotifications}
          markAllRead={this.markAllNotificationsRead}
          currentUser={currentUser}
          width={'480px'}
          loading={false}
          error={false}
        />
      </IconDrop>
    );
  }
}

export default compose(
  getNotifications,
  markNotificationsSeenMutation,
  viewNetworkHandler
)(NotificationsTab);
