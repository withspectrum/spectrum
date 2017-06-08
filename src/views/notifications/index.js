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
import { UpsellSignIn } from '../../components/upsell';

class NotificationsPure extends Component {
  render() {
    const { currentUser, notificationsQuery } = this.props;

    // our router should prevent this from happening, but just in case
    if (!currentUser) {
      return <UpsellSignIn />;
    }

    if (
      !notificationsQuery ||
      notificationsQuery.error ||
      notificationsQuery.loading
    ) {
      return <div>Error</div>;
    }

    const notifications =
      currentUser &&
      notificationsQuery.notifications.edges.map(notification =>
        parseNotification(notification.node)
      );

    console.log('notifications are', notifications);

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
