/**
 * The <Root /> component takes care of initially authenticating the user, showing the homepage or the app
 * and syncing the frequency and story from the URL to the Redux state. (including loading their data)
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { setInitialData } from './actions/loading';
import { setActiveFrequency } from './actions/frequencies';
import { setActiveStory } from './actions/stories';
import { setAllMessages } from './actions/messages';
import { asyncComponent, hashToArray } from './helpers/utils';
import { fetchStoriesForFrequencies } from './helpers/stories';
import LoadingIndicator from './shared/loading/global';

// Codesplit the App and the Homepage to only load what we need based on which route we're on
const App = asyncComponent(() =>
  System.import('./App').then(module => module.default));
const Homepage = asyncComponent(() =>
  System.import('./Homepage').then(module => module.default));

class Root extends Component {
  componentWillMount() {
    // On the initial render of the app we authenticate the user
    const { dispatch, params } = this.props;
    firebase.auth().onAuthStateChanged(user => {
      if (!user)
        return dispatch({
          type: 'USER_NOT_AUTHENTICATED',
        });
      let users = firebase.database().ref('users');

      // we know the user exists, so lets fetch their data by matching the uid
      users.orderByChild('uid').equalTo(user.uid).once('value', snapshot => {
        // once we've retreived our user, we can dispatch to redux and store their info in state
        const userData = snapshot.val()[user.uid];
        dispatch(
          setInitialData(
            userData,
            params.frequency || 'everything',
            params.story || '',
          ),
        );
      });
    });

    firebase.database().ref('frequencies').once('value').then(snapshot => {
      const frequencies = snapshot.val();
      fetchStoriesForFrequencies(frequencies).then(stories => {
        const result = [];
        // Flatten the stories
        stories.forEach(story => result.push(...hashToArray(story)));
        dispatch({
          type: 'SET_STORIES',
          stories: result,
        });
        dispatch({
          type: 'SET_FREQUENCIES',
          frequencies: hashToArray(snapshot.val()),
        });
      });
    });

    // Listen to changes in messages
    firebase.database().ref('messages').on('value', snapshot => {
      const messages = snapshot.val();
      dispatch(setAllMessages(messages));
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props;
    // If the frequency changes sync the active frequency to the store and load the stories
    if (nextProps.params.frequency !== params.frequency) {
      dispatch(setActiveFrequency(nextProps.params.frequency));
    }

    // If the story changes sync the active story to the store and load the messages
    if (nextProps.params.story !== params.frequency) {
      dispatch(setActiveStory(nextProps.params.story));
    }
  }

  render() {
    const { user, frequencies, params } = this.props;
    if (!user.loaded) return <LoadingIndicator />;
    if (!user.uid && params.frequency === undefined) return <Homepage />;
    if (user.loginError) return <p>Login error</p>;
    if (!frequencies.loaded) return <LoadingIndicator />;
    return <App />;
  }
}

export default connect(state => ({
  user: state.user || {},
  frequencies: state.frequencies || {},
}))(Root);
