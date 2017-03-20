import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavMaster from './components/NavMaster';
import {
  Body,
  NavMasterContainer,
  StoryMasterContainer,
  RightColumnContainer,
} from './style';
import StoryMaster from './components/StoryMaster';
import RightColumn from './components/RightColumn';
import LoadingIndicator from '../shared/loading';
import ModalRoot from '../shared/modals/ModalRoot';
import SelectUsernameModal from '../shared/modals/SelectUsernameModal';
import GalleryRoot from '../shared/gallery/GalleryRoot';
import NuxJoinCard from './components/StoryMaster/NuxJoinCard';
import LoginCard from './components/StoryMaster/LoginCard';
import { getCurrentFrequency } from '../helpers/frequencies';
import { sortArrayByKey, getParameterByName } from '../helpers/utils';

class App extends Component {
  state = {
    showDiscoverCard: true, // determines if we should show the NuxJoinCard
    selectModalOpen: true,
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      showDiscoverCard: Object.keys(nextProps.user.frequencies).length > 10
        ? false
        : true,
    });
  };

  closeSelectModal = () => {
    this.setState({
      selectModalOpen: false,
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
      'last_activity',
      'timestamp',
    )
      .reverse()
      .filter(story => !story.deleted);

    if (frequency && !frequency.active !== 'everything') {
      sortedStories = sortedStories.filter(story => {
        return story.frequencyId === frequency.id && story.published;
      });
    }

    if (
      isEverything && this.state.showDiscoverCard && user.uid ||
      user.uid && frequencies.active === 'discover'
    ) {
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

        <RightColumnContainer active={stories.active} viewing={ui.viewing}>
          <RightColumn
            title={getParameterByName('t', this.props.location.search)}
            description={getParameterByName('d', this.props.location.search)}
          />
        </RightColumnContainer>
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
