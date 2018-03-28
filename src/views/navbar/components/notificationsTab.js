// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import queryString from 'query-string';
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { updateNotificationsCount } from '../../../actions/notifications';
import { NotificationDropdown } from './notificationDropdown';
import getNotifications from 'shared/graphql/queries/notification/getNotifications';
import type { GetNotificationsType } from 'shared/graphql/queries/notification/getNotifications';
import markNotificationsSeenMutation from 'shared/graphql/mutations/notification/markNotificationsSeen';
import { markSingleNotificationSeenMutation } from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import { Tab, NotificationTab, Label } from '../style';
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
    notifications: GetNotificationsType,
    subscribeToNewNotifications: Function,
    refetch: Function,
  },
  refetch: Function,
  client: Function,
  dispatch: Function,
  count: number,
};

type State = {
  notifications: ?Array<any>,
  subscription: ?Function,
  shouldRenderDropdown: boolean,
};

class NotificationsTab extends React.Component<Props, State> {
  state = {
    notifications: null,
    subscription: null,
    shouldRenderDropdown: false,
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

    // when the notifications get set for the first time
    if (!prevState.notifications && nextState.notifications) return true;

    // when hovered
    if (!prevState.shouldRenderDropdown && nextState.shouldRenderDropdown)
      return true;

    // any time the count changes
    if (prevProps.count !== nextProps.count) return true;

    // any time the count changes
    if (
      prevState.notifications &&
      nextState.notifications &&
      prevState.notifications.length !== nextState.notifications.length
    )
      return true;

    return false;
  }

  componentDidUpdate(prevProps) {
    const {
      data: prevData,
      location: prevLocation,
      activeInboxThread: prevActiveInboxThread,
    } = prevProps;
    const curr = this.props;

    const { notifications } = this.state;

    if (!notifications && curr.data.notifications) {
      this.subscribe();
      return this.processAndMarkSeenNotifications();
    }

    // never update the badge if the user is viewing the notifications tab
    // set the count to 0 if the tab is active so that if a user loads
    // /notifications view directly, the badge won't update
    if (curr.active) {
      return curr.dispatch(updateNotificationsCount('notifications', 0));
    }

    // if the component updates for the first time
    if (!prevData.notifications && curr.data.notifications) {
      return this.processAndMarkSeenNotifications();
    }

    // if the component updates with changed or new notifications
    // if any are unseen, set the counts
    if (
      curr.data.notifications &&
      curr.data.notifications.edges &&
      prevData.notifications &&
      prevData.notifications.edges &&
      curr.data.notifications.edges.length > 0 &&
      curr.data.notifications.edges.length !==
        prevData.notifications.edges.length
    ) {
      return this.processAndMarkSeenNotifications();
    }

    const { thread: prevThreadParam } = queryString.parse(prevLocation.search);
    const { thread: thisThreadParam } = queryString.parse(curr.location.search);
    const prevParts = prevLocation.pathname.split('/');
    const thisParts = prevLocation.pathname.split('/');

    // changing slider
    if (prevThreadParam !== thisThreadParam)
      return this.processAndMarkSeenNotifications(notifications);

    // changing inbox thread
    if (prevActiveInboxThread !== curr.activeInboxThread)
      return this.processAndMarkSeenNotifications(notifications);

    // changing thread detail view
    if (prevParts[2] !== thisParts[2])
      return this.processAndMarkSeenNotifications();

    // when the component finishes a refetch
    if (prevProps.isRefetching && !curr.isRefetching) {
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

    return notifications.edges.map(n => n && n.node);
  };

  markAllAsSeen = () => {
    const { markAllNotificationsSeen, count } = this.props;
    const { notifications } = this.state;

    // don't perform a mutation is there are no unread notifs
    if (count === 0) return;

    const oldNotifications = notifications && notifications.slice();

    // Optimistically update the seen status of the notifications
    const newNotifications =
      notifications &&
      notifications.map(n => Object.assign({}, n, { isSeen: true }));
    this.processAndMarkSeenNotifications(newNotifications);
    // otherwise
    return markAllNotificationsSeen().catch(err => {
      console.error(err);
      // Undo the optimistic update from above
      this.processAndMarkSeenNotifications(oldNotifications);
    });
  };

  processAndMarkSeenNotifications = stateNotifications => {
    const {
      data: { notifications },
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

      // newly published threads have a context id that is equal to the thread's channel
      // we have to use different logic to mark these notifications as seen if a user views
      // the thread before clicking the notification
      const isNewThreadNotification = n.event === 'THREAD_CREATED';
      const isViewingANewlyPublishedThread =
        isNewThreadNotification &&
        n.entities.some(
          e =>
            e.id === activeInboxThread ||
            e.id === threadParam ||
            (isViewingThread && e.id === parts[2])
        );

      if (
        isViewingSlider ||
        isViewingInbox ||
        isViewingThreadDetail ||
        isViewingANewlyPublishedThread
      ) {
        // if the user shouldn't see a new notification badge,
        // mark it as seen before it ever hits the component
        const newNotification = Object.assign({}, n, {
          isSeen: true,
        });

        // and then mark it as seen on the server
        client.mutate({
          mutation: markSingleNotificationSeenMutation,
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

    return this.setCount(filteredByContext);
  };

  setCount = notifications => {
    const curr = this.props;

    if (!notifications || notifications.length === 0) {
      return curr.dispatch(updateNotificationsCount('notifications', 0));
    }

    const distinct = getDistinctNotifications(notifications);
    // set to 0 if no notifications exist yet
    if (!distinct || distinct.length === 0) {
      return curr.dispatch(updateNotificationsCount('notifications', 0));
    }

    // set to 0 if no notifications are unseen
    const unseen = distinct.filter(n => !n.isSeen);
    if (!unseen || unseen.length === 0) {
      return curr.dispatch(updateNotificationsCount('notifications', 0));
    }

    // count of unique unseen notifications
    const count = unseen.length;
    return curr.dispatch(updateNotificationsCount('notifications', count));
  };

  // this function gets triggered from downstream child notification components.
  // in certain cases, clicking on a notification should mark it as seen
  // and update the state in this parent container
  // as a result, we pass this function down a few levels of children
  markSingleNotificationAsSeenInState = (notificationId: string) => {
    const { notifications } = this.state;
    if (!notifications) return;
    const newNotifications = notifications.map(n => {
      if (n.id !== notificationId) return n;
      return Object.assign({}, n, {
        isSeen: true,
      });
    });

    this.setState({
      notifications: newNotifications,
    });

    return this.setCount(newNotifications);
  };

  setHover = () => {
    return this.setState({
      shouldRenderDropdown: true,
    });
  };

  render() {
    const { active, currentUser, isLoading, count } = this.props;
    const { notifications, shouldRenderDropdown } = this.state;

    return (
      <NotificationTab padOnHover onMouseOver={this.setHover}>
        <Tab
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
        </Tab>

        {shouldRenderDropdown && (
          <NotificationDropdown
            rawNotifications={notifications}
            count={count}
            markAllAsSeen={this.markAllAsSeen}
            currentUser={currentUser}
            width={'480px'}
            loading={isLoading}
            error={false}
            markSingleNotificationAsSeenInState={
              this.markSingleNotificationAsSeenInState
            }
          />
        )}
      </NotificationTab>
    );
  }
}

const map = state => ({
  activeInboxThread: state.dashboardFeed.activeThread,
  count: state.notifications.notifications,
});
export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  getNotifications,
  markNotificationsSeenMutation,
  viewNetworkHandler
)(NotificationsTab);
