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
import { asyncComponent } from './helpers/utils';
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

      // temporarily force-clear the messages so that it doesn't bloat the store
      dispatch({
        type: 'CLEAR_MESSAGES',
      });

      // we know the user exists, so lets fetch their frequencies
      firebase
        .database()
        .ref(`users/${user.uid}/public`)
        .once('value', snapshot => {
          const userData = snapshot.val();
          dispatch(
            setInitialData(
              userData,
              params.frequency || 'everything',
              params.story || '',
            ),
          );
          Object.keys(userData.frequencies).map((frequency, index) => {
            // Get the frequencies
            firebase
              .database()
              .ref(`frequencies/${frequency}/`)
              .once('value', snapshot => {
                const data = snapshot.val();
                dispatch({
                  type: 'ADD_FREQUENCY',
                  frequency: data,
                });
                if (index === Object.keys(userData.frequencies).length - 1)
                  dispatch({ type: 'FREQUENCIES_LOADED' });
                if (!data.stories) return;
                const stories = Object.keys(data.stories);
                if (stories.length === 0) return;
                stories.forEach(story => {
                  firebase
                    .database()
                    .ref(`stories/${story}`)
                    .once('value')
                    .then(snapshot => {
                      const storyData = snapshot.val();
                      if (!storyData.published) return;
                      dispatch({
                        type: 'ADD_STORY',
                        story: snapshot.val(),
                      });
                      if (!storyData.messages) return;
                      const messages = Object.keys(storyData.messages);
                      if (!messages || messages.length === 0) return;
                      messages.forEach(message => {
                        firebase
                          .database()
                          .ref(`messages/${message}`)
                          .once('value')
                          .then(snapshot => {
                            // console.log('in root about to dispatch a message')
                            dispatch({
                              type: 'ADD_MESSAGE',
                              message: snapshot.val(),
                            });
                          });
                      });
                    });
                });
              });
          });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props;
    // If the frequency changes sync the active frequency to the store and load the stories
    if (nextProps.params.frequency !== params.frequency) {
      dispatch(setActiveFrequency(nextProps.params.frequency));
    }

    // If the story changes sync the active story to the store and load the messages
    if (nextProps.params.story !== params.story) {
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
