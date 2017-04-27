import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import deepEqual from 'deep-eql';
import InfiniteList from '../../shared/InfiniteList';
import LoadingIndicator from '../../shared/loading/global';
import { Button, TextButton, IconButton, Spinner } from '../../shared/Globals';
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
import { toggleMessageComposer } from '../../actions/messageComposer';
import {
  unsubscribeFrequency,
  subscribeFrequency,
  setActiveFrequency,
} from '../../actions/frequencies';
import { openModal } from '../../actions/modals';
import Icon from '../../shared/Icons';
import StoryCard from './StoryCard';
import Notification from './Notification';
import MessageGroup from './MessageGroup';
import { ACTIVITY_TYPES } from '../../db/types';
import { getCurrentFrequency } from '../../helpers/frequencies';
import { listenForMessageGroups } from '../../db/users';
import { formatSenders } from '../../helpers/notifications';

class MiddleColumn extends Component {
  state = {
    jumpToTop: false,
  };

  shouldComponentUpdate(nextProps: Object) {
    return !deepEqual(nextProps, this.props);
  }

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

  toggleMessageComposer = () => {
    this.props.dispatch(toggleMessageComposer());
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = () => {
    this.props.dispatch(
      subscribeFrequency({
        frequencySlug: this.props.activeFrequency,
        communitySlug: this.props.communities.active,
      })
    );
  };

  editFrequency = () => {
    this.props.dispatch(
      openModal('FREQUENCY_EDIT_MODAL', this.props.frequency)
    );
  };

  showFrequenciesNav = () => {
    this.props.dispatch({
      type: 'SHOW_FREQUENCY_NAV',
    });
  };

  renderMessageGroup = ({ index, key }) => {
    const {
      notifications,
      messageGroups,
      activeMessageGroup,
      messageComposer,
    } = this.props;

    const messageGroup = messageGroups[index];
    const active =
      messageGroup.id === activeMessageGroup && !messageComposer.isOpen;

    return React.isValidElement(messageGroup)
      ? messageGroup
      : <MessageGroup
          link={`/messages/${messageGroup.id}`}
          messageGroup={messageGroup}
          active={
            messageGroup.id === activeMessageGroup && !messageComposer.isOpen
          }
        />;
  };

  renderNotification = ({ index, key }) => {
    const { activeStory, notifications } = this.props;
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
          name: `${formatSenders(senders)} ${isNewMsg ? 'replied:' : 'posted a new story'}`,
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
      communities: { communities, active },
    } = this.props;
    const story = stories[index];

    if (React.isValidElement(story)) return story;

    const isEverything = active === 'everything';
    const notification = notifications.find(
      notification =>
        notification.activityType === ACTIVITY_TYPES.NEW_MESSAGE &&
        notification.ids.story === story.id &&
        notification.read === false
    );
    const isNew = notifications.some(
      notification =>
        notification.activityType === ACTIVITY_TYPES.NEW_STORY &&
        notification.ids.story === story.id &&
        notification.read === false
    );
    const unreadMessages = notification ? notification.unread : 0;
    const freq = getCurrentFrequency(story.frequencyId, frequencies);
    const community =
      freq && communities.find(community => community.id === freq.communityId);
    const linkPrefix = isEverything
      ? `/everything`
      : `/${community.slug}/~${activeFrequency}`;
    return (
      <StoryCard
        isActive={activeStory === story.id}
        key={key}
        link={`${linkPrefix}/${story.id}`}
        media={story.content.media}
        messages={story.messages ? Object.keys(story.messages).length : 0}
        metaLink={isEverything && freq && `/${community.slug}/~${freq.slug}`}
        metaText={isEverything && freq && `~${freq.name}`}
        person={{
          photo: story.creator.photoURL,
          name: story.creator.displayName,
          uid: story.creator.uid,
        }}
        timestamp={story.last_activity || story.timestamp}
        title={story.content.title}
        unreadMessages={unreadMessages}
        isNew={isNew}
        story={story}
        participants={story.participants}
        metadata={story.metadata ? story.metadata : null}
      />
    );
  };

  jumpToTop = () => {
    if (this.storyList) {
      this.storyList.scrollTop = 0;
    }
  };

  openMessageGroup = e => {
    let messageGroupId = e.target.id;
  };

  render() {
    const {
      frequency,
      activeFrequency,
      communities: { active },
      stories,
      isPrivate,
      role,
      loggedIn,
      composer,
      messageComposer,
      notifications,
      user,
      messageGroups,
      activeMessageGroup,
    } = this.props;

    const isEverything = active === 'everything';
    const isNotifications = active === 'notifications';
    const isMessages = active === 'messages';
    const hidden = !role && isPrivate;

    if (!isEverything && hidden)
      return <LoadingBlock><Icon icon="lock" /></LoadingBlock>;
    if (!frequency && !isEverything && !isNotifications && !isMessages)
      return <LoadingBlock><Spinner /></LoadingBlock>;

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

    const canLoadNewStories = false;

    return (
      <Column>
        <StoryList innerRef={comp => this.storyList = comp}>
          <Overlay active={composer.isOpen} onClick={this.toggleComposer} />
          <Overlay
            active={messageComposer.isOpen}
            onClick={this.toggleMessageComposer}
          />

          {canLoadNewStories &&
            <NewIndicator onClick={this.loadStoriesAgain}>
              <Icon icon="scroll-top" reverse />
              New stories!
            </NewIndicator>}

          {/* {isNotifications && notifications.map(this.renderNotification)} */}

          {isNotifications &&
            <InfiniteList
              height={window.innerHeight - 50}
              width={window.innerWidth > 768 ? 480 : window.innerWidth}
              elementCount={notifications.length}
              elementRenderer={this.renderNotification}
              keyMapper={index => notifications[index].id}
            />}

          {isMessages &&
            <InfiniteList
              height={window.innerHeight - 50}
              width={window.innerWidth > 768 ? 511 : window.innerWidth}
              elementCount={messageGroups.length}
              elementRenderer={this.renderMessageGroup}
              keyMapper={index => messageGroups[index].id}
            />}

          {(isEverything || frequency) &&
            <InfiniteList
              height={window.innerHeight - 50}
              width={window.innerWidth > 768 ? 480 : window.innerWidth}
              elementCount={stories.length}
              elementRenderer={this.renderStory}
              keyMapper={index => stories[index].id}
            />}
        </StoryList>
      </Column>
    );
  }
}

const mapStateToProps = state => {
  return {
    composer: state.composer,
    messageComposer: state.messageComposer,
    communities: state.communities,
    activeStory: state.stories.active,
    notifications: state.notifications.notifications,
    frequencies: state.frequencies.frequencies,
    user: state.user,
    allStories: state.stories.stories,
    storiesLoaded: state.stories.loaded,
    loading: state.loading,
    activeMessageGroup: state.messageGroups.active,
  };
};

export default connect(mapStateToProps)(MiddleColumn);
