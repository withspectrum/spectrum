// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Route, withRouter } from 'react-router-dom';
import Icon from 'src/components/icon';
import Tooltip from 'src/components/tooltip';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { getAccessibilityActiveState } from './accessibility';
import { NavigationContext } from 'src/helpers/navigation-context';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { MIN_WIDTH_TO_EXPAND_NAVIGATION } from 'src/components/layout';
import { AvatarGrid, AvatarLink, Label, IconWrapper, RedDot } from './style';

type Props = {
  count: number,
  isActive: boolean,
  dispatch: Function,
  refetch: Function,
  currentUser?: Object,
};

const DirectMessagesTab = (props: Props) => {
  const { count } = props;

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
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});

export default compose(
  // $FlowIssue
  connect(map),
  viewNetworkHandler,
  withRouter,
  withCurrentUser
)(DirectMessagesTab);
