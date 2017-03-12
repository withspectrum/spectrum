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
  Everything,
} from './style';
import { toggleComposer } from '../../../actions/composer';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import { login } from '../../../actions/user';
import { openModal } from '../../../actions/modals';
import {
  Lock,
  NewPost,
  ClosePost,
  Settings,
  Menu,
} from '../../../shared/Icons';
import Card from '../Card';
import ShareCard from '../ShareCard';
import NuxJoinCard from '../NuxJoinCard';
import { ACTIVITY_TYPES } from '../../../db/types';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { formatSenders } from '../../../helpers/notifications';

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

  renderNotification = notification => {
    const {
      activityType,
      ids,
      id,
      senders,
      timestamp,
      contentBlocks,
    } = notification;
    const isNewMsg = activityType === ACTIVITY_TYPES.NEW_MESSAGE;
    // TODO: Notifications for new stories in frequencies
    if (!isNewMsg) return;

    return (
      <Card
        key={id}
        link={isNewMsg ? `/notifications/${ids.story}` : `/~${ids.frequency}`}
        messages={notification.occurrences}
        // metaLink={isEverything && freq && `/~${freq.slug}`}
        // metaText={isEverything && freq && `~${freq.name}`}
        person={{
          photo: '',
          name: `${formatSenders(senders)} ${isNewMsg
            ? 'replied to your story'
            : 'posted a new story'}`,
        }}
        timestamp={timestamp}
        title={contentBlocks[contentBlocks.length - 1]}
      />
    );
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
      user,
    } = this.props;

    const isEverything = activeFrequency === 'everything';
    const isNotifications = activeFrequency === 'notifications';
    const hidden = !role && isPrivate;

    if (!isEverything && hidden) return <Lock />;
    if (!frequency && !isEverything && !isNotifications)
      return <LoadingBlock><LoadingIndicator /></LoadingBlock>;

    let storyText = 'No stories yet 😢';
    if (frequency && frequency.stories) {
      const length = Object.keys(frequency.stories).length;

      if (length === 1) {
        storyText = '1 story';
      } else {
        storyText = `${length} stories`;
      }
    }

    let membersText = 'No members yet 😢';
    if (frequency && frequency.users && Object.keys(frequency.users).length) {
      const length = Object.keys(frequency.users).length;

      if (length === 1) {
        membersText = '1 member';
      } else {
        membersText = `${length} members`;
      }
    }

    return (
      <Column navVisible={navVisible}>
        <Header>
          {!isEverything &&
            !isNotifications &&
            <FlexCol>
              <FreqTitle>

                <MenuButton onClick={this.toggleNav}>
                  <Menu stayActive color={'brand'} />
                </MenuButton>

                ~ {frequency.name}
              </FreqTitle>
              <FlexRow>
                {user.uid && <Count>{membersText}</Count>}

                {user.uid && <Count>{storyText}</Count>}
              </FlexRow>
              {frequency.description
                ? <Description>{frequency.description}</Description>
                : <span />}
            </FlexCol>}
          <Actions visible={loggedIn}>
            {!(isEverything || role === 'owner' || hidden || isNotifications) &&
              (role
                ? <JoinBtn member={role} onClick={this.unsubscribeFrequency}>
                    Leave
                  </JoinBtn>
                : <JoinBtn onClick={this.subscribeFrequency}>Join</JoinBtn>)}

            {role === 'owner' &&
              <TipButton
                onClick={this.editFrequency}
                tipText="Frequency Settings"
                tipLocation="bottom"
              >
                <Settings color={'brand'} />
              </TipButton>}

            {(isEverything || role) &&
              <Everything>
                <span />
                {isEverything &&
                  <MenuButton everything onClick={this.toggleNav}>
                    <Menu stayActive color={'brand'} />
                  </MenuButton>}

                {isEverything && '~Everything'}

                <TipButton
                  onClick={this.toggleComposer}
                  tipText="New Story"
                  tipLocation="bottom"
                >
                  {composer.isOpen
                    ? <ClosePost color="warn" />
                    : <NewPost color="brand" stayActive />}
                </TipButton>
              </Everything>}
          </Actions>

        </Header>

        <ScrollBody>
          <Overlay active={composer.isOpen} />

          {!loggedIn &&
            <LoginWrapper onClick={this.login}>
              <LoginText>Sign in to join the conversation.</LoginText>
              <LoginButton>Sign in with Twitter</LoginButton>
            </LoginWrapper>}

          {isNotifications && notifications.map(this.renderNotification)}

          {isEverything || frequency
            ? stories.filter(story => story.published).map((story, i) => {
                const notification = notifications.find(
                  notification =>
                    notification.activityType === ACTIVITY_TYPES.NEW_MESSAGE &&
                    notification.ids.story === story.id &&
                    notification.read === false,
                );
                const isNew = notifications.some(
                  notification =>
                    notification.activityType === ACTIVITY_TYPES.NEW_STORY &&
                    notification.ids.story === story.id &&
                    notification.read === false,
                );
                const unreadMessages = notification ? notification.unread : 0;
                const freq = isEverything &&
                  getCurrentFrequency(story.frequencyId, frequencies);
                return (
                  <Card
                    isActive={activeStory === story.id}
                    key={`story-${i}`}
                    link={`/~${activeFrequency}/${story.id}`}
                    media={story.content.media}
                    messages={
                      story.messages ? Object.keys(story.messages).length : 0
                    }
                    metaLink={isEverything && freq && `/~${freq.slug}`}
                    metaText={isEverything && freq && `~ ${freq.name}`}
                    person={{
                      photo: story.creator.photoURL,
                      name: story.creator.displayName,
                    }}
                    timestamp={story.timestamp}
                    title={story.content.title}
                    unreadMessages={unreadMessages}
                    isNew={isNew}
                  />
                );
              })
            : ''}

          {!isEverything &&
            frequency &&
            <ShareCard slug={activeFrequency} name={frequency.name} />}

          {isEverything &&
            frequencies.length === 0 && // user is viewing everything but isn't subscribed to anything
            <NuxJoinCard />}
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
    user: state.user,
  };
};

export default connect(mapStateToProps)(StoryMaster);
