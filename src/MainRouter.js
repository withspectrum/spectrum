import React from 'react';
import { Route, Router } from 'react-router-dom';
import { connect } from 'react-redux';
import Raven from 'raven-js';
import { set, track } from './EventTracker';
import { Body } from './App/style';
import Root from './Root';
import { monitorUser, stopUserMonitor } from './helpers/users';
import history from './helpers/history';
import { addNotification } from './actions/notifications';
import { getUserInfo } from './db/users';
import { listenToAuth } from './db/auth';
import { getFrequency } from './db/frequencies';
import { getCommunity } from './db/communities';
import { listenToNewNotifications } from './db/notifications';
import { listenToNewMessages } from './db/messageGroups';
import { addMessageGroup } from './actions/messageGroups';

class MainRouter extends React.Component {
  // INITIAL LOAD OF THE APP
  componentDidMount() {
    const { dispatch } = this.props;
    // On the initial render of the app we authenticate the user
    listenToAuth(user => {
      if (!user) {
        stopUserMonitor();
        return dispatch({
          type: 'USER_NOT_AUTHENTICATED',
        });
      }

      monitorUser(user.uid);

      // set this uid in google analytics
      track('user', 'authed', null);
      set(user.uid);

      // logs the user uid to sentry errors
      Raven.setUserContext({ uid: user.uid });

      listenToNewNotifications(user.uid, notification => {
        dispatch(addNotification(notification));
      });

      listenToNewMessages(user.uid, group => {
        dispatch(addMessageGroup(group));
      });

      // Get the public userdata
      getUserInfo(user.uid)
        .then(userData => {
          if (!userData) {
            return dispatch({
              type: 'USER_NOT_AUTHENTICATED',
            });
          }
          dispatch({
            type: 'SET_USER',
            user: userData,
          });
          return userData;
        })
        // Load the users frequencies and communities
        .then(({ frequencies, communities }) => {
          const freqIds = Object.keys(frequencies);
          const communityIds = Object.keys(communities);
          return Promise.all([
            Promise.all(freqIds.map(id => getFrequency({ id }))),
            Promise.all(communityIds.map(id => getCommunity({ id }))),
          ]);
        })
        .then(([frequencies, communities]) => {
          dispatch({
            type: 'SET_COMMUNITIES',
            communities,
          });
          dispatch({
            type: 'SET_FREQUENCIES',
            frequencies,
          });
        });
    });
  }

  render() {
    return (
      <Router history={history}>
        <Body>
          <Route exact path="/" component={Root} />
          <Route exact path="/:community" component={Root} />
          <Route exact path="/:community/(\~?):frequency" component={Root} />
          <Route
            exact
            path="/:community/(\~?):frequency/:story"
            component={Root}
          />
        </Body>
      </Router>
    );
  }
}

export default connect()(MainRouter);
