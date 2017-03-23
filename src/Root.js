/**
 * The <Root /> component takes care of initially authenticating the user, showing the homepage or the app
 * and syncing the frequency and story from the URL to the Redux state. (including loading their data)
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveFrequency } from './actions/frequencies';
import { setActiveStory } from './actions/stories';
import { addNotification } from './actions/notifications';
import { asyncComponent } from './helpers/utils';
import LoadingIndicator from './shared/loading/global';
import { getUserInfo } from './db/users';
import { listenToAuth } from './db/auth';
import { getFrequency } from './db/frequencies';
import { listenToNewNotifications } from './db/notifications';
import { set, track } from './EventTracker';
import { monitorUser, stopUserMonitor } from './helpers/users';

// Codesplit the App and the Homepage to only load what we need based on which route we're on
const App = asyncComponent(() =>
  System.import('./App').then(module => module.default));
const Homepage = asyncComponent(() =>
  System.import('./Homepage').then(module => module.default));

class Root extends Component {
  state = {
    frequency: '',
    story: '',
  };

  // INITIAL LOAD OF THE APP
  componentWillMount() {
    // On the initial render of the app we authenticate the user
    const { dispatch, match } = this.props;
    this.handleProps({ frequencies: {}, stories: {}, match });
    // Authenticate the user
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

      listenToNewNotifications(user.uid, notification => {
        dispatch(addNotification(notification));
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
          return userData.frequencies;
        })
        // Load the users frequencies
        .then(frequencies => {
          const keys = Object.keys(frequencies);
          return Promise.all(keys.map(key => getFrequency({ id: key })));
        })
        .then(frequencies => {
          dispatch({
            type: 'SET_FREQUENCIES',
            frequencies,
          });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  handleProps = nextProps => {
    const { dispatch, match: { params }, frequencies, stories } = this.props;
    // If the frequency changes or we've finished loading the frequencies sync the active frequency to the store and load the stories
    if (
      nextProps.frequencies.loaded !== frequencies.loaded ||
      nextProps.match.params.frequency !== params.frequency
    ) {
      dispatch(
        setActiveFrequency(nextProps.match.params.frequency || 'everything'),
      );
    }

    // If the story changes sync the active story to the store and load the messages
    if (
      nextProps.stories.loaded !== stories.loaded ||
      nextProps.match.params.story !== params.story
    ) {
      dispatch(setActiveStory(nextProps.match.params.story));
    }
  };

  render() {
    const { user, match: { params }, location } = this.props;
    // Handle loading the homepage
    if (params.frequency === undefined) {
      if (user.loginError) return <p>Login error</p>;
      if (user.uid) return <App location={location} />;
      if (user.loaded) return <Homepage />;
      return <LoadingIndicator />;
    }
    return <App location={location} />;
  }
}

export default connect(state => ({
  user: state.user || {},
  frequencies: state.frequencies || {},
  stories: state.stories || {},
}))(Root);
