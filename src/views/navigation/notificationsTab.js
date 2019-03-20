// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tooltip from 'src/components/tooltip';
import compose from 'recompose/compose';
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
import markNotificationsSeenMutation from 'shared/graphql/mutations/notification/markNotificationsSeen';
import { getAccessibilityActiveState } from './accessibility';
import { NavigationContext } from 'src/routes';
import { addToastWithTimeout } from 'src/actions/toasts';
import formatNotification from 'shared/notification-to-text';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

type Props = {
  isActive: boolean,
  count: number,
  data: {
    notifications?: GetNotificationsType,
    subscribeToNewNotifications: Function,
  },
  markAllNotificationsSeen: Function,
  dispatch: Function,
  match: Object,
  currentUser?: Object,
};

const NotificationsTab = (props: Props) => {
  const { count, data, isActive, match, currentUser } = props;

  // $FlowIssue Subscribe on mount
  React.useEffect(() => {
    const unsubscribe = data.subscribeToNewNotifications(notification => {
      const { title } = formatNotification(
        notification,
        currentUser && currentUser.id
      );
      props.dispatch(addToastWithTimeout('success', title));
    });
    return unsubscribe;
  }, []);

  const unseenCount =
    data.notifications &&
    data.notifications.edges
      .filter(Boolean)
      .reduce((count, { node }) => (node.isSeen ? count : count + 1), 0);
  // $FlowIssue Mark all as seen when the tab becomes active
  React.useEffect(() => {
    const count = data.notifications
      ? data.notifications.edges
          .filter(Boolean)
          .filter(({ node }) => !node.isSeen).length
      : 0;
    props.dispatch(
      setNotifications(
        data.notifications
          ? data.notifications.edges.filter(Boolean).map(({ node }) => node)
          : []
      )
    );
    props.dispatch(
      updateNotificationsCount('notifications', props.active ? 0 : count)
    );
    if (isActive) props.markAllNotificationsSeen();
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
        <Tooltip content="Notifications" placement={'left'}>
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
  markNotificationsSeenMutation,
  viewNetworkHandler,
  withRouter,
  withCurrentUser
)(NotificationsTab);
