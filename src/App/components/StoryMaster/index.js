import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Column,
  Header,
  ScrollBody,
  JoinBtn,
  LoginWrapper,
  LoginText,
  LoginButton,
  TipButton,
  Overlay,
  MenuButton
} from './style';
import { toggleComposer } from '../../../actions/composer';
import {
  toggleFrequencyPrivacy,
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import { login } from '../../../actions/user';
import { showModal } from '../../../actions/modals';
import {
  getFrequencyPermission,
  getCurrentFrequency,
} from '../../../helpers/frequencies';
import { sortArrayByKey } from '../../../helpers/utils';
import { Lock, NewPost, ClosePost } from '../../../shared/Icons';
import StoryCard from '../StoryCard';
import ShareCard from '../ShareCard';

class StoryMaster extends Component {
  toggleComposer = () => {
    this.props.dispatch(toggleComposer());
  };

  togglePrivacy = () => {
    this.props.dispatch(toggleFrequencyPrivacy());
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency());
  };

  subscribeFrequency = () => {
    this.props.dispatch(subscribeFrequency());
  };

  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  editFrequency = () => {
    let frequencyData = getCurrentFrequency(
      this.props.frequencies.active,
      this.props.frequencies.frequencies,
    );

    this.props.dispatch(showModal('FREQUENCY_EDIT_MODAL', frequencyData));
  };

  toggleNav = () => {
    this.props.dispatch({
      type: 'TOGGLE_NAV'
    })
  }

  render() {
    const { user, stories, frequencies, composer } = this.props;

    const frequencyData = getCurrentFrequency(
      frequencies.active,
      frequencies.frequencies,
    );

    const isEverything = frequencies.active === 'everything';
    const isPrivate = frequencyData && frequencyData[0].settings.private;
    const role = getFrequencyPermission(
      user,
      frequencies.active,
      frequencies.frequencies,
    );
    const hidden = !role && isPrivate;

    if (!isEverything && hidden) return <Lock />;

    // Show stories in reverse chronological order
    let sortedStories = sortArrayByKey(
      stories.stories.slice(),
      'timestamp',
    ).reverse();

    if (frequencyData && !isEverything) {
      sortedStories = sortedStories.filter(
        story => {
          return story.frequency === frequencyData[0].id
        }
      );
    }

    return (
      <Column navVisible={this.props.ui.navVisible}>
        <Header visible={user.uid}>
          <MenuButton onClick={this.toggleNav}>☰</MenuButton>

          {role === 'owner' &&
            <TipButton
              onClick={this.editFrequency}
              tipText="Frequency Settings"
              tipLocation="bottom"
            >
              <Lock />
            </TipButton>}

          {(isEverything || role) &&
            <TipButton
              onClick={this.toggleComposer}
              tipText="New Story"
              tipLocation="bottom"
            >
              {composer.isOpen
                ? <ClosePost color="warn" />
                : <NewPost color="brand" stayActive />}
            </TipButton>}

          {!(isEverything || role === 'owner' || hidden) &&
            (role
              ? <JoinBtn member onClick={this.unsubscribeFrequency}>
                  Leave
                </JoinBtn>
              : <JoinBtn onClick={this.subscribeFrequency}>Join</JoinBtn>)}          
        </Header>

        <ScrollBody>
          <Overlay active={composer.isOpen} />
          {!user.uid &&
            <LoginWrapper onClick={this.login}>
              <LoginText>Sign in to join the conversation.</LoginText>
              <LoginButton>Sign in with Twitter</LoginButton>
            </LoginWrapper>}

          {isEverything || frequencyData
            ? sortedStories.map((story, i) => (
                <StoryCard
                  urlBase={`~${frequencies.active}`}
                  data={story}
                  key={`story-${i}`}
                />
              ))
            : ''}

          {!isEverything &&
            frequencyData &&
            <ShareCard slug={frequencies.active} name={frequencyData.name} />}
        </ScrollBody>
      </Column>
    );
  }
}

const mapStateToProps = state => {
  return {
    stories: state.stories,
    frequencies: state.frequencies,
    composer: state.composer,
    user: state.user,
    ui: state.ui,
  };
};

export default connect(mapStateToProps)(StoryMaster);
