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
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

type Props = {
  active: boolean,
  count: number,
  data: {
    notifications?: GetNotificationsType,
    subscribeToNewNotifications: Function,
  },
  markAllNotificationsSeen: Function,
  dispatch: Function,
};

const NotificationsTab = (props: Props) => {
  const { count, data } = props;

  // $FlowIssue Subscribe on mount
  React.useEffect(() => {
    const unsubscribe = data.subscribeToNewNotifications();
    return unsubscribe;
  }, []);

  const unseenCount =
    data.notifications &&
    data.notifications.edges
      .filter(Boolean)
      .reduce((count, { node }) => (node.isSeen ? count : count + 1), 0);
  // $FlowIssue Mark all as seen when the tab becomes active
  React.useEffect(
    () => {
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
      if (props.active) props.markAllNotificationsSeen();
    },
    [
      props.active,
      data.notifications && data.notifications.edges.length,
      unseenCount,
    ]
  );

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
  withRouter
)(NotificationsTab);
