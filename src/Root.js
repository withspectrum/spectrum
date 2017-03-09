/**
 * The <Root /> component takes care of initially authenticating the user, showing the homepage or the app
 * and syncing the frequency and story from the URL to the Redux state. (including loading their data)
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveFrequency } from './actions/frequencies';
import { setActiveStory } from './actions/stories';
import { asyncComponent } from './helpers/utils';
import { groupNotifications } from './helpers/notifications';
import LoadingIndicator from './shared/loading/global';
import { getPublicUserInfo, listenToAuth } from './db/users';
import { getFrequency } from './db/frequencies';
import { listenToNotifications } from './db/notifications';
import { set, track } from './EventTracker';

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
      if (!user)
        return dispatch({
          type: 'USER_NOT_AUTHENTICATED',
        });

      // temporarily force-clear the messages so that it doesn't bloat the store
      dispatch({
        type: 'CLEAR_MESSAGES',
      });

      // set this uid in google analytics
      track('user', 'authed', null);
      set(user.uid);

      listenToNotifications(user.uid, notifications => {
        dispatch({
          type: 'SET_NOTIFICATIONS',
          notifications: groupNotifications(notifications),
        });
      });

      // Get the public userdata
      getPublicUserInfo(user.uid)
        .then(userData => {
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
    const { user, frequencies, match: { params } } = this.props;
    // Handle loading the homepage
    if (params.frequency === undefined) {
      if (user.loginError) return <p>Login error</p>;
      if (user.uid) return <App />;
      if (user.loaded) return <Homepage />;
      return <LoadingIndicator />;
    }
    return <App />;
  }
}

export default connect(state => ({
  user: state.user || {},
  frequencies: state.frequencies || {},
  stories: state.stories || {},
}))(Root);
