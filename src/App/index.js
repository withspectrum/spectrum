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
import NuxJoinCard from './components/NuxJoinCard';
import {
  getCurrentFrequency,
  getFrequencyPermission,
} from '../helpers/frequencies';
import { sortArrayByKey } from '../helpers/utils';

class App extends Component {
  state = {
    nuxFrequency: true,
  };

  componentDidMount = () => {
    let numUserFrequencies = Object.keys(this.props.user.frequencies).length;
    // using state here so that it doesn't randomly disappear whenever the user joins their Nth frequency
    this.setState({
      nuxFrequency: numUserFrequencies > 200 ? false : true,
    });
  };

  render() {
    const { stories, frequencies, user, ui } = this.props;
    const frequency = getCurrentFrequency(
      frequencies.active,
      frequencies.frequencies,
    );

    const isEverything = frequencies.active === 'everything';

    let sortedStories = sortArrayByKey(
      stories.stories.slice(),
      'timestamp',
    ).reverse();

    if (frequency && !frequency.active !== 'everything') {
      sortedStories = sortedStories.filter(story => {
        return story.frequencyId === frequency.id &&
          story.published &&
          !story.deleted;
      });
    }
    if (isEverything && this.state.nuxFrequency) {
      sortedStories.unshift(<NuxJoinCard />);
    }

    return (
      <Body>
        <ModalRoot />
        <GalleryRoot />
        <LoadingIndicator />

        <NavMasterContainer viewing={ui.viewing}>
          <NavMaster />
        </NavMasterContainer>

        <StoryMasterContainer active={stories.active} viewing={ui.viewing}>
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
