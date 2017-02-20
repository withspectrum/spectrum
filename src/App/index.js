import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavMaster from './components/NavMaster';
import { Body } from './style';
import StoryMaster from './components/StoryMaster';
import DetailView from './components/DetailView';
import LoadingIndicator from '../shared/loading';
import { setActiveFrequency } from '../actions/frequencies';
import { setActiveStory, loadStories } from '../actions/stories';
import { loadMessages } from '../actions/messages';

class App extends Component {
  componentWillMount() {
    const { dispatch, params } = this.props;

    const activeFrequencyParam = params.frequency || 'all';
    const activeStoryParam = params.story || '';
    dispatch(setActiveFrequency(activeFrequencyParam));

    if (activeStoryParam) {
      dispatch(setActiveStory(activeStoryParam));
      dispatch(loadMessages());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params } = this.props;
    if (nextProps.params.frequency !== params.frequency) {
      dispatch(setActiveFrequency(nextProps.params.frequency));
      dispatch(loadStories());
    }

    if (nextProps.params.story !== params.frequency) {
      dispatch(setActiveStory(nextProps.params.story));
      dispatch(loadMessages());
    }
  }

  render() {
    return (
      <Body>
        <LoadingIndicator />
        <NavMaster />
        <StoryMaster />
        <DetailView />
      </Body>
    );
  }
}

export default connect()(App);
