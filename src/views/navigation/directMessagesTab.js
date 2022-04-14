// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Route, withRouter } from 'react-router-dom';
import Icon from 'src/components/icon';
import Tooltip from 'src/components/tooltip';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { updateNotificationsCount } from 'src/actions/notifications';
import getUnreadDMQuery, {
  type GetDirectMessageNotificationsType,
} from 'shared/graphql/queries/notification/getDirectMessageNotifications';
import markDirectMessageNotificationsSeenMutation from 'shared/graphql/mutations/notification/markDirectMessageNotificationsSeen';
import { getAccessibilityActiveState } from './accessibility';
import { NavigationContext } from 'src/helpers/navigation-context';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { MIN_WIDTH_TO_EXPAND_NAVIGATION } from 'src/components/layout';
import formatNotification from 'shared/notification-to-text';
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

type Props = {
  count: number,
  data: {
    directMessageNotifications?: GetDirectMessageNotificationsType,
  },
  isActive: boolean,
  subscribeToDMs: Function,
  markDirectMessageNotificationsSeen: Function,
  dispatch: Function,
  refetch: Function,
  currentUser?: Object,
};

const DirectMessagesTab = (props: Props) => {
  const { count, data, isActive, currentUser } = props;

  // $FlowIssue
  React.useEffect(() => {
    const unsubscribe = props.subscribeToDMs(notification => {
      const { title, body } = formatNotification(
        notification,
        currentUser && currentUser.id
      );
      // TODO @mxstbr - make this clickable and not show up if the user
      // is currently viewing the DM (modal or view)
      // props.dispatch(addToastWithTimeout('notification', title));
    });
    return unsubscribe;
  }, []);

  const unseenCount = data.directMessageNotifications
    ? data.directMessageNotifications.edges
        .filter(Boolean)
        .reduce((count, { node }) => (node.isSeen ? count : count + 1), 0)
    : 0;
  // $FlowIssue Mark all as seen when the tab becomes active
  React.useEffect(() => {
    props.dispatch(
      updateNotificationsCount(
        'directMessageNotifications',
        isActive ? 0 : unseenCount
      )
    );
    if (isActive)
      props.markDirectMessageNotificationsSeen().then(() => props.refetch());
  }, [
    data.directMessageNotifications &&
      data.directMessageNotifications.edges.length,
    unseenCount,
    isActive,
  ]);

  // Keep the dock icon notification count indicator of the desktop app in sync
  if (isDesktopApp()) {
    window.interop.setBadgeCount(unseenCount);
  }

  const isWideViewport =
    window && window.innerWidth > MIN_WIDTH_TO_EXPAND_NAVIGATION;

  return (
    <NavigationContext.Consumer>
      {({ setNavigationIsOpen }) => (
        <Route path="/messages">
          {({ match }) => (
            <Tooltip
              content="Messages"
              placement={'left'}
              isEnabled={!isWideViewport}
            >
              <AvatarGrid isActive={match && match.url.includes('/messages')}>
                <AvatarLink
                  to={'/messages'}
                  data-cy="navigation-messages"
                  onClick={() => setNavigationIsOpen(false)}
                  {...getAccessibilityActiveState(
                    match && match.url.includes('/messages')
                  )}
                >
                  <IconWrapper>
                    <Icon glyph="message-simple" />
                    {count > 0 && (
                      <RedDot
                        data-cy="unread-dm-badge"
                        style={{ right: '-3px' }}
                      />
                    )}
                  </IconWrapper>

                  <Label>Messages</Label>
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
  count: state.notifications.directMessageNotifications,
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});

export default compose(
  // $FlowIssue
  connect(map),
  getUnreadDMQuery,
  markDirectMessageNotificationsSeenMutation,
  viewNetworkHandler,
  withRouter,
  withCurrentUser
)(DirectMessagesTab);
