import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavMaster from './components/NavMaster';
import { Body } from './style';
import StoryMaster from './components/StoryMaster';
import DetailView from './components/DetailView';
import LoadingIndicator from '../shared/loading';
import ModalRoot from '../shared/modals/ModalRoot';
import GalleryRoot from '../shared/gallery/GalleryRoot';
import {
  getCurrentFrequency,
  getFrequencyPermission,
} from '../helpers/frequencies';
import { sortArrayByKey } from '../helpers/utils';

class App extends Component {
  render() {
    const { stories, frequencies, user } = this.props;
    const frequency = getCurrentFrequency(
      frequencies.active,
      frequencies.frequencies,
    );
    let sortedStories = sortArrayByKey(
      stories.stories.slice(),
      'timestamp',
    ).reverse();
    if (frequency && !frequency.active !== 'everything') {
      sortedStories = sortedStories.filter(story => {
        return story.frequencyId === frequency.id;
      });
    }
    return (
      <Body>
        <ModalRoot />
        <GalleryRoot />
        <LoadingIndicator />
        <NavMaster />
        <StoryMaster
          loggedIn={!!user.uid}
          role={
            user &&
              frequency &&
              user.frequencies[frequency.id] &&
              user.frequencies[frequency.id].permission
          }
          activeFrequency={frequencies.active}
          isPrivate={frequency && frequency.settings.private}
          stories={sortedStories}
          frequency={frequency}
        />
        <DetailView />
      </Body>
    );
  }
}

export default connect(state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
}))(App);
