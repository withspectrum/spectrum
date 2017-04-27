/**
 * The <Root /> component takes care of initially authenticating the user, showing the homepage or the app
 * and syncing the frequency and story from the URL to the Redux state. (including loading their data)
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveFrequency } from './actions/frequencies';
import { setActiveMessageGroup } from './actions/messageGroups';
import { setActiveStory } from './actions/stories';
import { setActiveCommunity } from './actions/communities';
import { asyncComponent } from './helpers/utils';
import LoadingIndicator from './shared/loading/global';
import history from './helpers/history';

// Codesplit the App and the Homepage to only load what we need based on which route we're on
const App = asyncComponent(() =>
  System.import('./App').then(module => module.default)
);
const Homepage = asyncComponent(() =>
  System.import('./Homepage').then(module => module.default)
);

class Root extends Component {
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    if (
      !params.frequency &&
      params.community &&
      params.community !== 'everything' &&
      params.community !== 'explore' &&
      params.community !== 'messages'
    ) {
      history.push(`/${params.community}/~general`);
      return;
    }

    dispatch(setActiveCommunity(params.community || 'everything'));

    if (params.community === 'everything') {
      dispatch(setActiveStory(params.frequency));
    } else if (params.community === 'messages') {
      dispatch(setActiveMessageGroup(params.frequency));
    } else {
      dispatch(setActiveFrequency(params.frequency));
      dispatch(setActiveStory(params.story));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps;

    if (nextProps.match.params.community === 'messages') {
      if (
        this.props.match.params.frequency !== nextProps.match.params.frequency
      ) {
        dispatch(setActiveMessageGroup(nextProps.match.params.frequency));
      }
    }

    if (
      this.props.match.params.community !== nextProps.match.params.community ||
      nextProps.user.uid !== this.props.user.uid
    ) {
      dispatch(
        setActiveCommunity(nextProps.match.params.community || 'everything')
      );
    }

    if (
      // If the community changed, refetch the frequency
      this.props.match.params.community !== nextProps.match.params.community ||
      this.props.match.params.frequency !== nextProps.match.params.frequency
    ) {
      if (nextProps.match.params.community === 'everything') {
        dispatch(setActiveStory(nextProps.match.params.frequency));
      } else {
        dispatch(setActiveFrequency(nextProps.match.params.frequency));
      }
    }

    if (this.props.match.params.story !== nextProps.match.params.story) {
      if (nextProps.match.params.community !== 'everything') {
        dispatch(setActiveStory(nextProps.match.params.story));
      }
    }
  }

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
  communities: state.communities || {},
  stories: state.stories || {},
}))(Root);
