// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tooltip from 'src/components/tooltip';
import compose from 'recompose/compose';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';
import Icon from 'src/components/icons';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { updateNotificationsCount } from 'src/actions/notifications';
import getNotifications from 'shared/graphql/queries/notification/getNotifications';
import markNotificationsSeenMutation from 'shared/graphql/mutations/notification/markNotificationsSeen';
import { markSingleNotificationSeenMutation } from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import { getAccessibilityActiveState } from './accessibility';
import { NavigationContext } from 'src/routes';
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

type State = {
  notifications: ?Array<any>,
  subscription: ?Function,
};

class NotificationsTab extends React.Component<Props, State> {
  state = {
    notifications: null,
    subscription: null,
  };

  componentDidUpdate(prev: Props) {
    const {
      data: prevData,
      location: prevLocation,
      activeInboxThread: prevActiveInboxThread,
    } = prev;
    const curr = this.props;

    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }

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
      prevData.notifications &&
      prevData.notifications.edges &&
      curr.data.notifications &&
      curr.data.notifications.edges &&
      curr.data.notifications.edges.length > 0 &&
      curr.data.notifications.edges.length !==
        prevData.notifications.edges.length
    ) {
      return this.processAndMarkSeenNotifications();
    }

    const prevThreadParam = prev.threadSlider.threadId;
    const thisThreadParam = curr.threadSlider.threadId;
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
    if (prev.isRefetching && !curr.isRefetching) {
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
    this.processAndMarkSeenNotifications(newNotifications, false);
    // otherwise
    return markAllNotificationsSeen().catch(err => {
      console.error(err);
      // Undo the optimistic update from above
      this.processAndMarkSeenNotifications(oldNotifications, false);
    });
  };

  processAndMarkSeenNotifications = (stateNotifications, sync = true) => {
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
    // i.e. a new notification was received, so we should therefore run
    // the rest of this method on the incoming notifications data
    const nodes = stateNotifications
      ? stateNotifications
      : this.convertEdgesToNodes(notifications);

    // if no notifications exist
    if (!nodes || nodes.length === 0) return this.setCount();

    // get distinct notifications by id
    const distinct = deduplicateChildren(nodes, 'id');

    /*
      1. If the user is viewing a thread in a modal, don't display a notification
        badge for that thread, and mark any incoming notifications for that
        thread as seen
      2. If the user is viewing a ?t= url in the inbox, same logic
      3. If the user is viewing the thread view, same logic
    */

    const filteredByContext = distinct.map(n => {
      const contextId = n.context.id;
      const threadParam = this.props.threadSlider.threadId;

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
        if (sync) {
          client.mutate({
            mutation: markSingleNotificationSeenMutation,
            variables: {
              id: n.id,
            },
          });
        }

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

    const distinct = deduplicateChildren(notifications, 'id');
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

  render() {
    const { count } = this.props;

    // Keep the dock icon notification count indicator of the desktop app in sync
    if (isDesktopApp()) {
      window.interop.setBadgeCount(count);
    }

    return (
      <NavigationContext.Consumer>
        {({ setNavigationIsOpen }) => (
          <Route path="/notifications">
            {({ match }) => (
              <Tooltip title="Notifications">
                <AvatarGrid
                  isActive={match && match.url.includes('/notifications')}
                >
                  <AvatarLink
                    to={'/notifications'}
                    data-cy="navbar-notifications"
                    onClick={() => setNavigationIsOpen(false)}
                    {...getAccessibilityActiveState(
                      match && match.url.includes('/notifications')
                    )}
                  >
                    <IconWrapper>
                      <Icon glyph="notification" />
                      {count > 0 && <RedDot />}
                    </IconWrapper>

                    <Label>Notifications</Label>
                  </AvatarLink>
                </AvatarGrid>
              </Tooltip>
            )}
          </Route>
        )}
      </NavigationContext.Consumer>
    );
  }
}

const map = state => ({
  count: state.notifications.notifications,
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
  threadSlider: state.threadSlider,
});

export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  getNotifications,
  markNotificationsSeenMutation,
  viewNetworkHandler,
  withRouter
)(NotificationsTab);
