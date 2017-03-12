import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavMaster from './components/NavMaster';
import {
  Body,
  NavMasterContainer,
  StoryMasterContainer,
  DetailViewContainer,
} from './style';
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
    const { stories, frequencies, user, ui } = this.props;
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

        <NavMasterContainer viewing={ui.viewing}>
          <NavMaster />
        </NavMasterContainer>

        <StoryMasterContainer viewing={ui.viewing}>
          <StoryMaster
            loggedIn={!!user.uid}
            role={
              user &&
                frequency &&
                frequency.users[user.uid] &&
                frequency.users[user.uid].permission
            }
            activeFrequency={frequencies.active}
            isPrivate={frequency && frequency.settings.private}
            stories={sortedStories}
            frequency={frequency}
          />
        </StoryMasterContainer>

        <DetailViewContainer active={stories.active} viewing={ui.viewing}>
          {' '}
          {/* if a story is active, we need to set this view position for mobile  */
          }
          <DetailView />
        </DetailViewContainer>
      </Body>
    );
  }
}

export default connect(state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
  ui: state.ui,
}))(App);
