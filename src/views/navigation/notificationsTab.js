// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tooltip from 'src/components/tooltip';
import compose from 'recompose/compose';
import { MIN_WIDTH_TO_EXPAND_NAVIGATION } from 'src/components/layout';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';
import Icon from 'src/components/icon';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import {
  updateNotificationsCount,
  setNotifications,
} from 'src/actions/notifications';
import getNotifications, {
  type GetNotificationsType,
} from 'shared/graphql/queries/notification/getNotifications';
import markSingleNotificationSeenMutation from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import { getAccessibilityActiveState } from './accessibility';
import { NavigationContext } from 'src/helpers/navigation-context';
import formatNotification from 'shared/notification-to-text';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

type Props = {
  isActive: boolean,
  count: number,
  location: Object,
  data: {
    notifications?: GetNotificationsType,
    subscribeToNewNotifications: Function,
  },
  markSingleNotificationSeen: Function,
  dispatch: Function,
  match: Object,
  currentUser?: Object,
};

const NotificationsTab = (props: Props) => {
  const { count, data, isActive, match, currentUser } = props;

  const isWideViewport =
    window && window.innerWidth > MIN_WIDTH_TO_EXPAND_NAVIGATION;

  // $FlowIssue Subscribe on mount
  React.useEffect(() => {
    const unsubscribe = data.subscribeToNewNotifications(notification => {
      const { title } = formatNotification(
        notification,
        currentUser && currentUser.id
      );
      // TODO @mxstbr - make this clickable and not show up if the user
      // is currently viewing the thing the notification is about - mainly
      // thread view and new user joins on community
      // props.dispatch(addToastWithTimeout('notification', title));
    });
    return unsubscribe;
  }, []);

  const unseenCount =
    data.notifications &&
    data.notifications.edges
      .filter(Boolean)
      .reduce((count, { node }) => (node.isSeen ? count : count + 1), 0);

  React.useEffect(() => {
    let currentViewNotifications = [];
    let unseenNotifications = [];

    if (data.notifications) {
      data.notifications.edges
        .filter(Boolean)
        .forEach(({ node: notification }) => {
          if (notification.isSeen) return;
          if (props.location.pathname.indexOf(notification.context.id) > -1) {
            currentViewNotifications.push(notification);
            return;
          }
          unseenNotifications.push(notification);
        });
    }

    if (currentViewNotifications.length > 0) {
      // Mark notifications for current view as seen
      currentViewNotifications.forEach(notification =>
        props.markSingleNotificationSeen(notification.id)
      );
    }
    const count = unseenNotifications.length;
    props.dispatch(setNotifications(unseenNotifications));
    props.dispatch(updateNotificationsCount('notifications', count));
  }, [
    isActive,
    data.notifications && data.notifications.edges.length,
    unseenCount,
  ]);

  // Keep the dock icon notification count indicator of the desktop app in sync
  if (isDesktopApp()) {
    window.interop.setBadgeCount(count);
  }

  return (
    <NavigationContext.Consumer>
      {({ setNavigationIsOpen }) => (
        <Tooltip
          content="Notifications"
          placement={'left'}
          isEnabled={!isWideViewport}
        >
          <AvatarGrid isActive={isActive}>
            <AvatarLink
              to={'/notifications'}
              data-cy="navigation-notifications"
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
    </NavigationContext.Consumer>
  );
};

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
  markSingleNotificationSeenMutation,
  viewNetworkHandler,
  withRouter,
  withCurrentUser
)(NotificationsTab);
