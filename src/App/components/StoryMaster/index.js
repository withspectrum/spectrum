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
  MenuButton,
  FreqTitle,
  Count,
  FlexCol,
  FlexRow,
  Description,
  Actions,
} from './style';
import { toggleComposer } from '../../../actions/composer';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import { login } from '../../../actions/user';
import { openModal } from '../../../actions/modals';
import { Lock, NewPost, ClosePost, Settings } from '../../../shared/Icons';
import StoryCard from '../StoryCard';
import ShareCard from '../ShareCard';

class StoryMaster extends Component {
  toggleComposer = () => {
    this.props.dispatch(toggleComposer());
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = () => {
    this.props.dispatch(subscribeFrequency(this.props.activeFrequency));
  };

  login = e => {
    e.preventDefault();
    this.props.dispatch(login());
  };

  editFrequency = () => {
    this.props.dispatch(
      openModal('FREQUENCY_EDIT_MODAL', this.props.frequency),
    );
  };

  toggleNav = () => {
    this.props.dispatch({
      type: 'TOGGLE_NAV',
    });
  };

  render() {
    const {
      frequency,
      activeFrequency,
      stories,
      isPrivate,
      role,
      loggedIn,
      composer,
      ui: { navVisible },
      activeStory,
    } = this.props;

    const isEverything = activeFrequency === 'everything';
    const hidden = !role && isPrivate;

    if (!isEverything && hidden) return <Lock />;
    if (!frequency && !isEverything) return <p>Loading...</p>;

    return (
      <Column navVisible={navVisible}>
        <Header>
          {!isEverything &&
            <FlexCol>
              <FreqTitle>~ {frequency.name}</FreqTitle>
              <FlexRow>
                <Count>{Object.keys(frequency.users).length} members</Count>
                <Count>{Object.keys(frequency.stories).length} stories</Count>
              </FlexRow>
              {frequency.description
                ? <Description>{frequency.description}</Description>
                : <span />}
            </FlexCol>}
          <Actions visible={loggedIn}>
            <MenuButton onClick={this.toggleNav}>☰</MenuButton>

            {!(isEverything || role === 'owner' || hidden) &&
              (role
                ? <Settings color={'brand'} />
                : <JoinBtn onClick={this.subscribeFrequency}>Join</JoinBtn>)}

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
          </Actions>

        </Header>

        <ScrollBody>
          <Overlay active={composer.isOpen} />

          {!loggedIn &&
            <LoginWrapper onClick={this.login}>
              <LoginText>Sign in to join the conversation.</LoginText>
              <LoginButton>Sign in with Twitter</LoginButton>
            </LoginWrapper>}

          {isEverything || frequency
            ? stories.map((story, i) => (
                <StoryCard
                  urlBase={`~${activeFrequency}`}
                  story={story}
                  isEverything={isEverything}
                  frequency={frequency}
                  key={`story-${i}`}
                  active={activeStory}
                />
              ))
            : ''}

          {!isEverything &&
            frequency &&
            <ShareCard slug={activeFrequency} name={frequency.name} />}
        </ScrollBody>
      </Column>
    );
  }
}

const mapStateToProps = state => {
  return {
    composer: state.composer,
    ui: state.ui,
    activeStory: state.stories.active,
  };
};

export default connect(mapStateToProps)(StoryMaster);
