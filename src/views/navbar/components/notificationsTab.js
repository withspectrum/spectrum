// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import queryString from 'query-string';
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
  isRefetching: boolean,
  markAllNotificationsSeen: Function,
  activeInboxThread: ?string,
  location: Object,
  data: {
    notifications?: {
      edges: Array<any>,
    },
    subscribeToNewNotifications: Function,
    refetch: Function,
  },
  refetch: Function,
  client: Function,
};

type State = {
  count: number,
  notifications: Array<any>,
  subscription: ?Function,
};

class NotificationsTab extends React.Component<Props, State> {
  state = {
    count: 0,
    notifications: [],
    subscription: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const prevProps = this.props;
    const prevState = this.state;

    const prevLocation = prevProps.location;
    const nextLocation = nextProps.location;
    const { thread: prevThreadParam } = queryString.parse(prevLocation.search);
    const { thread: nextThreadParam } = queryString.parse(nextLocation.search);
    const prevActiveInboxThread = prevProps.activeInboxThread;
    const nextActiveInboxThread = nextProps.activeInboxThread;
    const prevParts = prevLocation.pathname.split('/');
    const nextParts = nextLocation.pathname.split('/');

    // changing slider
    if (prevThreadParam !== nextThreadParam) return true;

    // changing inbox thread
    if (prevActiveInboxThread !== nextActiveInboxThread) return true;

    // changing thread detail view
    if (prevParts[2] !== nextParts[2]) return true;

    // if a refetch completes
    if (prevProps.isRefetching !== nextProps.isRefetching) return true;

    // once the initial query finishes loading
    if (!prevProps.data.notifications && nextProps.data.notifications)
      return true;

    // after refetch
    if (prevProps.isRefetching !== nextProps.isRefetching) return true;

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

    // if the user clicks on the notifications tab
    if (prevProps.active !== nextProps.active) return true;

    // any time the count changes
    if (prevState.count !== nextState.count) return true;

    // any time the count changes
    if (prevState.notifications.length !== nextState.notifications.length)
      return true;

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      data: prevData,
      active: prevActive,
      location: prevLocation,
      activeInboxThread: prevActiveInboxThread,
    } = prevProps;
    const {
      data: thisData,
      active: thisActive,
      location: thisLocation,
      client,
      activeInboxThread: thisActiveInboxThread,
    } = this.props;

    const { subscription, notifications } = this.state;

    // never update the badge if the user is viewing the notifications tab
    // set the count to 0 if the tab is active so that if a user loads
    // /notifications view directly, the badge won't update
    if (thisActive) {
      this.processAndMarkSeenNotifications(notifications);
      return this.setState({
        count: 0,
      });
    }

    const { thread: prevThreadParam } = queryString.parse(prevLocation.search);
    const { thread: thisThreadParam } = queryString.parse(thisLocation.search);
    const prevParts = prevLocation.pathname.split('/');
    const thisParts = prevLocation.pathname.split('/');

    // changing slider
    if (prevThreadParam !== thisThreadParam)
      return this.processAndMarkSeenNotifications(notifications);

    // changing inbox thread
    if (prevActiveInboxThread !== thisActiveInboxThread)
      return this.processAndMarkSeenNotifications(notifications);

    // changing thread detail view
    if (prevParts[2] !== thisParts[2])
      return this.processAndMarkSeenNotifications();

    // if the component updates for the first time
    if (!prevData.notifications && thisData.notifications) {
      this.subscribe();
      return this.processAndMarkSeenNotifications();
    }

    // when the component finishes a refetch
    if (prevProps.isRefetching && !this.props.isRefetching) {
      return this.processAndMarkSeenNotifications();
    }

    // if the component updates with changed or new notifications
    // if any are unseen, set the counts
    if (
      thisData.notifications &&
      thisData.notifications.edges &&
      prevData.notifications &&
      prevData.notifications.edges &&
      thisData.notifications.edges.length > 0 &&
      thisData.notifications.edges.length !==
        prevData.notifications.edges.length
    ) {
      return this.processAndMarkSeenNotifications();
    }
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

  convertEdgesToNodes = notifications => {
    if (
      !notifications ||
      !notifications.edges ||
      notifications.edges.length === 0
    )
      return [];

    return notifications.edges.map(n => n.node);
  };

  markAllAsSeen = () => {
    const { markAllNotificationsSeen, refetch } = this.props;
    const { count, notifications } = this.state;

    // don't perform a mutation is there are no unread notifs
    if (count === 0) return;

    // otherwise
    return markAllNotificationsSeen()
      .then(() => {
        // notifs were marked as seen
        const newNotifications = notifications.map(n =>
          Object.assign({}, n, { isSeen: true })
        );
        this.processAndMarkSeenNotifications(newNotifications);
        return refetch();
      })
      .catch(err => {
        // err
      });
  };

  processAndMarkSeenNotifications = stateNotifications => {
    const {
      data: { notifications, refetch },
      location,
      client,
      activeInboxThread,
    } = this.props;

    // in componentDidUpdate, we can optionally pass in the notifications
    // from state. this is useful for when a user is navigating around the site
    // and we want to mark notifications as read as they view threads
    // if we do not pass in notifications from the state when this method is
    // invoked, it is because the incoming props have changed from the server
    // i.e. a new notification was recieved, so we should therefore run
    // the rest of this method on the incoming notifications data
    const nodes = stateNotifications
      ? stateNotifications
      : this.convertEdgesToNodes(notifications);

    // if no notifications exist
    if (!nodes || nodes.length === 0) return this.setCount();

    // get distinct notifications by id
    const distinct = getDistinctNotifications(nodes);

    /*
      1. If the user is viewing a ?thread= url, don't display a notification
        badge for that thread, and mark any incoming notifications for that
        thread as seen
      2. If the user is viewing a ?t= url in the inbox, same logic
      3. If the user is viewing the thread view, same logic
    */

    const filteredByContext = distinct.map(n => {
      const contextId = n.context.id;
      const { thread: threadParam } = queryString.parse(location.search);
      // 1
      const isViewingSlider = threadParam === contextId && !n.isSeen;
      // 2
      const isViewingInbox = activeInboxThread
        ? activeInboxThread === contextId && !n.isSeen
        : false;
      const parts = location.pathname.split('/');
      const isViewingThread = parts[1] === 'thread';
      // 3
      const isViewingThreadDetail = isViewingThread
        ? parts[2] === contextId && !n.isSeen
        : false;

      if (isViewingSlider || isViewingInbox || isViewingThreadDetail) {
        // if the user shouldn't see a new notification badge,
        // mark it as seen before it ever hits the component
        const newNotification = Object.assign({}, n, {
          isSeen: true,
        });

        // and then mark it as seen on the server
        client.mutate({
          mutation: MARK_SINGLE_NOTIFICATION_SEEN_MUTATION,
          variables: {
            id: n.id,
          },
        });

        return newNotification;
      } else {
        return n;
      }
    });

    this.setState({ notifications: filteredByContext });

    // if we are performing a local state update, go ahead and refetch data
    // from the server to update our props
    stateNotifications && refetch();
    return this.setCount(filteredByContext);
  };

  setCount = notifications => {
    if (!notifications || notifications.length == 0) {
      return this.setState({
        count: 0,
      });
    }

    const distinct = getDistinctNotifications(notifications);
    // set to 0 if no notifications exist yet
    if (!distinct || distinct.length === 0) {
      return this.setState({
        count: 0,
      });
    }

    // set to 0 if no notifications are unseen
    const unseen = distinct.filter(n => !n.isSeen);
    if (!unseen || unseen.length === 0) {
      return this.setState({
        count: 0,
      });
    }

    // count of unique unseen notifications
    const count = unseen.length;

    return this.setState({
      count,
    });
  };

  render() {
    const { active, currentUser, data, isLoading } = this.props;
    const { count, notifications } = this.state;

    return (
      <IconDrop>
        <Head>
          {count > 0 ? (
            <link
              rel="shortcut icon"
              id="dynamic-favicon"
              // $FlowIssue
              href={`${process.env.PUBLIC_URL}/img/favicon_unread.ico`}
            />
          ) : (
            <link
              rel="shortcut icon"
              id="dynamic-favicon"
              // $FlowIssue
              href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
            />
          )}
        </Head>

        <IconLink
          data-active={active}
          to="/notifications"
          rel="nofollow"
          onClick={this.markAllAsSeen}
        >
          <Icon
            glyph={count > 0 ? 'notification-fill' : 'notification'}
            withCount={count > 10 ? '10+' : count > 0 ? count : false}
          />
          <Label hideOnDesktop>Notifications</Label>
        </IconLink>

        <NotificationDropdown
          rawNotifications={notifications}
          count={count}
          markAllAsSeen={this.markAllAsSeen}
          currentUser={currentUser}
          width={'480px'}
          loading={isLoading}
          error={false}
        />
      </IconDrop>
    );
  }
}

const map = state => ({ activeInboxThread: state.dashboardFeed.activeThread });
export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  getNotifications,
  markNotificationsSeenMutation,
  viewNetworkHandler
)(NotificationsTab);
