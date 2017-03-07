import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '../../../shared/loading/global';
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
  LoadingBlock,
} from './style';
import { toggleComposer } from '../../../actions/composer';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import { login } from '../../../actions/user';
import { openModal } from '../../../actions/modals';
import { Lock, NewPost, ClosePost, Settings } from '../../../shared/Icons';
import GenericCard from '../GenericCard';
import ShareCard from '../ShareCard';
import { ACTIVITY_TYPES } from '../../../db/types';
import { getCurrentFrequency } from '../../../helpers/frequencies';

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
      frequencies,
      stories,
      isPrivate,
      role,
      loggedIn,
      composer,
      ui: { navVisible },
      activeStory,
      notifications,
    } = this.props;

    const isEverything = activeFrequency === 'everything';
    const isNotifications = activeFrequency === 'notifications';
    const hidden = !role && isPrivate;

    if (!isEverything && hidden) return <Lock />;
    if (!frequency && !isEverything)
      return <LoadingBlock><LoadingIndicator /></LoadingBlock>;

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
            ? stories.filter(story => story.published).map((story, i) => {
                const unread = notifications.filter(
                  notification =>
                    notification.activityType === ACTIVITY_TYPES.NEW_MESSAGE &&
                    notification.objectId === story.id &&
                    notification.read === false,
                ).length;
                const freq = isEverything &&
                  getCurrentFrequency(story.frequencyId, frequencies);
                return (
                  <GenericCard
                    isActive={activeStory === story.id}
                    key={`story-${i}`}
                    link={`/~${activeFrequency}/${story.id}`}
                    media={story.content.media}
                    messages={
                      story.messages ? Object.keys(story.messages).length : 0
                    }
                    metaLink={isEverything && freq && `/~${freq.slug}`}
                    metaText={isEverything && freq && `~${freq.name}`}
                    person={{
                      photo: story.creator.photoURL,
                      name: story.creator.displayName,
                    }}
                    timestamp={story.timestamp}
                    title={story.content.title}
                    unread={unread}
                  />
                );
              })
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
    notifications: state.notifications.notifications,
    frequencies: state.frequencies.frequencies,
  };
};

export default connect(mapStateToProps)(StoryMaster);
