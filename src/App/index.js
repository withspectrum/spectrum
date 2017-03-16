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
import SelectUsernameModal from '../shared/modals/SelectUsernameModal';
import GalleryRoot from '../shared/gallery/GalleryRoot';
import NuxJoinCard from './components/StoryMaster/NuxJoinCard';
import LoginCard from './components/StoryMaster/LoginCard';
import {
  getCurrentFrequency,
  getFrequencyPermission,
} from '../helpers/frequencies';
import { sortArrayByKey } from '../helpers/utils';

class App extends Component {
  state = {
    nuxFrequency: true, // determines if we should show the NuxJoinCard
    selectModalOpen: true,
  };

  componentDidMount = () => {
    let numUserFrequencies = Object.keys(this.props.user.frequencies).length;
    // set in state so it doesn't disappear when the user's freq count updates
    this.setState({
      nuxFrequency: numUserFrequencies > 10 ? false : true,
    });
  };

  closeSelectModal = () => {
    this.setState({
      selectModalOpen: false,
    });
  };

  render() {
    const { stories, frequencies, user, ui, loading } = this.props;
    const frequency = getCurrentFrequency(
      frequencies.active,
      frequencies.frequencies,
    );

    const isEverything = frequencies.active === 'everything';

    let sortedStories = sortArrayByKey(
      stories.stories.slice(),
      'last_activity',
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

    if (!user.uid) {
      sortedStories.unshift(<LoginCard />);
    }

    return (
      <Body>
        <ModalRoot />
        <GalleryRoot />
        <LoadingIndicator />

        <NavMasterContainer viewing={ui.viewing}>
          <NavMaster />
        </NavMasterContainer>

        {/* If the user is logged in, but hasn't selected a username yet prompt them to */
        }
        {!!user.uid &&
          (!user.username || !user.email) &&
          <SelectUsernameModal
            isOpen={this.state.selectModalOpen}
            promptEmail={!user.email}
            onClose={this.closeSelectModal}
          />}

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
  loading: state.loading,
}))(App);
