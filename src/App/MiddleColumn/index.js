import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteList from './InfiniteList';
import LoadingIndicator from '../../shared/loading/global';
import { Button, TextButton, IconButton } from '../../shared/Globals';
import {
  Column,
  Header,
  Overlay,
  MenuButton,
  FreqTitle,
  Count,
  FlexCol,
  FlexRow,
  Spread,
  Description,
  Actions,
  LoadingBlock,
  StoryList,
  NewIndicator,
} from './style';
import { toggleComposer } from '../../actions/composer';
import {
  unsubscribeFrequency,
  subscribeFrequency,
  setActiveFrequency,
} from '../../actions/frequencies';
import { openModal } from '../../actions/modals';
import Icon from '../../shared/Icons';
import StoryCard from './StoryCard';
import Notification from './Notification';
import { ACTIVITY_TYPES } from '../../db/types';
import { getCurrentFrequency } from '../../helpers/frequencies';
import { formatSenders } from '../../helpers/notifications';

class MiddleColumn extends Component {
  state = {
    jumpToTop: false,
  };

  componentWillUpdate = nextProps => {
    if (nextProps.activeFrequency !== this.props.activeFrequency) {
      this.setState({
        jumpToTop: true,
      });
    }
  };

  componentDidUpdate = () => {
    if (this.state.jumpToTop) {
      this.jumpToTop();
      this.setState({
        jumpToTop: false,
      });
    }
  };

  loadStoriesAgain = () => {
    this.props.dispatch(setActiveFrequency(this.props.activeFrequency));
  };

  toggleComposer = () => {
    this.props.dispatch(toggleComposer());
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = () => {
    this.props.dispatch(subscribeFrequency(this.props.activeFrequency));
  };

  editFrequency = () => {
    this.props.dispatch(
      openModal('FREQUENCY_EDIT_MODAL', this.props.frequency),
    );
  };

  showFrequenciesNav = () => {
    this.props.dispatch({
      type: 'SHOW_FREQUENCY_NAV',
    });
  };

  renderNotification = ({ index, key }) => {
    const {
      activeStory,
      notifications,
    } = this.props;
    const {
      activityType,
      ids,
      senders,
      timestamp,
      contentBlocks,
      read,
      occurrences,
    } = notifications[index];
    const isNewMsg = activityType === ACTIVITY_TYPES.NEW_MESSAGE;
    // TODO: Notifications for new stories in frequencies
    if (!isNewMsg) return;

    return (
      <Notification
        key={key}
        isActive={activeStory === ids.story}
        isRead={read}
        link={isNewMsg ? `/notifications/${ids.story}` : `/~${ids.frequency}`}
        messages={occurrences}
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

  renderStory = ({ index, key }) => {
    const {
      notifications,
      stories,
      frequencies,
      activeFrequency,
      activeStory,
    } = this.props;
    const isEverything = activeFrequency === 'everything';
    const story = stories[index];

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
    return React.isValidElement(story)
      ? story
      : <StoryCard
          isActive={activeStory === story.id}
          key={key}
          link={`/~${activeFrequency}/${story.id}`}
          media={story.content.media}
          messages={story.messages ? Object.keys(story.messages).length : 0}
          metaLink={isEverything && freq && `/~${freq.slug}`}
          metaText={isEverything && freq && `~${freq.name}`}
          person={{
            photo: story.creator.photoURL,
            name: story.creator.displayName,
          }}
          timestamp={story.last_activity || story.timestamp}
          title={story.content.title}
          unreadMessages={unreadMessages}
          isNew={isNew}
          participants={story.participants}
        />;
  };

  jumpToTop = () => {
    if (this.storyList) {
      this.storyList.scrollTop = 0;
    }
  };

  render() {
    const {
      frequency,
      activeFrequency,
      // allStories,
      stories,
      isPrivate,
      role,
      loggedIn,
      composer,
      notifications,
      user,
      // storiesLoaded,
    } = this.props;

    const isEverything = activeFrequency === 'everything';
    const isNotifications = activeFrequency === 'notifications';
    const hidden = !role && isPrivate;

    if (!isEverything && hidden)
      return <LoadingBlock><Icon icon="lock" /></LoadingBlock>;
    if (!frequency && !isEverything && !isNotifications)
      return <LoadingBlock><LoadingIndicator /></LoadingBlock>;

    let storyText = 'No stories yet 😢';
    if (frequency && frequency.stories) {
      // get number of stories, filtering out deleted stories
      const length = Object.keys(frequency.stories)
        .map(key => frequency.stories[key])
        .filter(story => !story.deleted).length;

      if (length === 1) {
        storyText = '1 story';
      } else if (length > 1) {
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

    // If we have a notification for a story but not loaded the story yet
    // show the New Stories! indicator
    const canLoadNewStories = false;

    // storiesLoaded &&
    //   notifications.some(notification => {
    //     if (notification.activityType !== ACTIVITY_TYPES.NEW_STORY)
    //       return false;
    //     if (!isEverything && notification.ids.frequency !== frequency.id)
    //       return false;
    //
    //     const result = allStories.find(
    //       story => story.id === notification.ids.story,
    //     );
    //     if (!result) return true;
    //     return false;
    //   });

    return (
      <Column>
        <Header>
          {!isEverything &&
            !isNotifications &&
            <FlexCol>
              <FlexRow>
                <MenuButton onClick={this.showFrequenciesNav}>
                  <Icon icon="menu" />
                </MenuButton>
                <FreqTitle onClick={this.jumpToTop}>
                  ~ {frequency.name}
                </FreqTitle>
              </FlexRow>
              <Spread>
                {user.uid && <Count>{membersText}</Count>}

                {user.uid && <Count>{storyText}</Count>}
              </Spread>
              {frequency.description
                ? <Description>{frequency.description}</Description>
                : <span />}
            </FlexCol>}
          <Actions visible={loggedIn}>
            {!(isEverything || role === 'owner' || hidden || isNotifications) &&
              (role
                ? <TextButton member={role} onClick={this.unsubscribeFrequency}>
                    Leave {activeFrequency}
                  </TextButton>
                : <Button onClick={this.subscribeFrequency}>
                    Join {activeFrequency}
                  </Button>)}

            {role === 'owner' &&
              <IconButton onClick={this.editFrequency}>
                <Icon
                  icon="settings"
                  subtle
                  tipText="Frequency Settings"
                  tipLocation="right"
                />
              </IconButton>}

            {isEverything &&
              <MenuButton onClick={this.showFrequenciesNav}>
                <Icon icon="menu" />
              </MenuButton>}

            {isEverything &&
              <FreqTitle onClick={this.jumpToTop}>Home</FreqTitle>}

            {isNotifications &&
              <FreqTitle onClick={this.jumpToTop}>Notifications</FreqTitle>}

            {isNotifications &&
              <IconButton>
                <Icon
                  icon="settings"
                  subtle
                  tipText="Notification Settings"
                  tipLocation="right"
                />
              </IconButton>}

            {isNotifications ||
              <IconButton onClick={this.toggleComposer}>
                <Icon
                  icon={composer.isOpen ? 'write-cancel' : 'write'}
                  tipLocation="left"
                  tipText="New Story"
                  color={composer.isOpen ? 'warn.alt' : 'brand.default'}
                />
              </IconButton>}
          </Actions>
        </Header>

        <StoryList innerRef={comp => this.storyList = comp}>
          <Overlay active={composer.isOpen} onClick={this.toggleComposer} />

          {canLoadNewStories &&
            <NewIndicator onClick={this.loadStoriesAgain}>
              <Icon icon="scroll-top" reverse />
              New stories!
            </NewIndicator>}

          {/* {isNotifications && notifications.map(this.renderNotification)} */
          }

          {isNotifications &&
            <InfiniteList
              height={window.innerHeight - 50}
              width={window.innerWidth > 768 ? 419 : window.innerWidth}
              elementCount={notifications.length}
              elementRenderer={this.renderNotification}
            />}

          {(isEverything || frequency) &&
            <InfiniteList
              height={window.innerHeight - 50}
              width={window.innerWidth > 768 ? 419 : window.innerWidth}
              elementCount={stories.length}
              elementRenderer={this.renderStory}
            />}
        </StoryList>
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
    allStories: state.stories.stories,
    storiesLoaded: state.stories.loaded,
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(MiddleColumn);
