//@flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { parseNotification } from './utils';
import { NewMessageNotification } from './components/newMessageNotification';
import { NewReactionNotification } from './components/newReactionNotification';
import { Column } from '../../components/column';
import AppViewWrapper from '../../components/appViewWrapper';
import { displayLoadingNotifications } from '../../components/loading';
import { getNotifications } from '../../api/notification';
import {
  UpsellSignIn,
  UpsellToReload,
  UpsellNullNotifications,
} from '../../components/upsell';

class NotificationsPure extends Component {
  render() {
    const { currentUser, notificationsQuery } = this.props;

    if (!currentUser) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            <UpsellSignIn />
          </Column>
        </AppViewWrapper>
      );
    }

    if (
      !notificationsQuery ||
      notificationsQuery.error ||
      notificationsQuery.loading
    ) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            <UpsellToReload />
          </Column>
        </AppViewWrapper>
      );
    }

    const notifications = notificationsQuery.notifications.edges.map(
      notification => parseNotification(notification.node)
    );

    if (!notifications || notifications.length === 0) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            <UpsellNullNotifications />
          </Column>
        </AppViewWrapper>
      );
    }

    return (
      <AppViewWrapper>
        <Column type={'primary'}>
          {notifications.map(notification => {
            switch (notification.event) {
              case 'MESSAGE_CREATED': {
                return (
                  <NewMessageNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                  />
                );
              }
              case 'REACTION_CREATED': {
                return (
                  <NewReactionNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                  />
                );
              }
              default: {
                return null;
              }
            }
          })}
        </Column>
      </AppViewWrapper>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  getNotifications,
  displayLoadingNotifications,
  connect(mapStateToProps),
  pure
)(NotificationsPure);
