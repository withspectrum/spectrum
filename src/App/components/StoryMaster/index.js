import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  List,
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
} from 'react-virtualized';
import LoadingIndicator from '../../../shared/loading/global';
import {
  Column,
  Header,
  ScrollBody,
  JoinBtn,
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
  StoryList,
  NewIndicator,
} from './style';
import { toggleComposer } from '../../../actions/composer';
import {
  unsubscribeFrequency,
  subscribeFrequency,
  setActiveFrequency,
} from '../../../actions/frequencies';
import { openModal } from '../../../actions/modals';
import Icon from '../../../shared/Icons';
import Card from '../Card';
import { ACTIVITY_TYPES } from '../../../db/types';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { formatSenders } from '../../../helpers/notifications';

const MIN_STORY_CARD_HEIGHT = 109;

function arraysEqualById(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    // This is story specific!
    if (a[i].id !== b[i].id) return false;
  }
  return true;
}

class StoryMaster extends Component {
  state = {
    jumpToTop: false,
    cache: new CellMeasurerCache({
      fixedWidth: true,
      minHeight: MIN_STORY_CARD_HEIGHT,
      keyMapper: index => this.props.stories[index].id,
    }),
  };

  componentWillReceiveProps = nextProps => {
    // If any of the things the story list cares about change,
    // rerender the list
    if (
      arraysEqualById(this.props.stories, nextProps.stories) &&
      nextProps.activeStory === this.props.activeStory &&
      nextProps.activeFrequency === this.props.activeFrequency &&
      arraysEqualById(this.props.notifications, nextProps.notifications) &&
      nextProps.stories.every(
        (story, index) =>
          !story.participants ||
          arraysEqualById(
            story.participants,
            this.props.stories[index].participants,
          ),
      )
    )
      return;

    this.setState({
      jumpToTop: true,
      cache: new CellMeasurerCache({
        fixedWidth: true,
        minHeight: MIN_STORY_CARD_HEIGHT,
        keyMapper: index => nextProps.stories[index].id,
      }),
    });
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

  renderStory = ({ index, key, style, parent }) => {
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
    return (
      <CellMeasurer
        cache={this.state.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style}>
          {React.isValidElement(story)
            ? story
            : <Card
                isActive={activeStory === story.id}
                key={key}
                style={style}
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
                timestamp={story.last_activity || story.timestamp}
                title={story.content.title}
                unreadMessages={unreadMessages}
                isNew={isNew}
                participants={story.participants}
              />}
        </div>
      </CellMeasurer>
    );
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
      frequencies,
      stories,
      isPrivate,
      role,
      loggedIn,
      composer,
      activeStory,
      notifications,
      user,
      storiesLoaded,
      loading,
    } = this.props;

    const isEverything = activeFrequency === 'everything';
    const isNotifications = activeFrequency === 'notifications';
    const hidden = !role && isPrivate;

    if (!isEverything && hidden) return <Icon icon="lock" />;
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

    const canLoadNewStories = storiesLoaded &&
      notifications.some(notification => {
        if (!isEverything && notification.ids.frequency !== frequency.id)
          return false;

        return stories.every(story => story.id !== notification.ids.story);
      });

    return (
      <Column>
        <Header>
          {!isEverything &&
            !isNotifications &&
            <FlexCol>
              <FreqTitle>

                <MenuButton onClick={this.showFrequenciesNav}>
                  <Icon icon="menu" />
                </MenuButton>

                <a onClick={this.jumpToTop}>~ {frequency.name}</a>
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
                : <JoinBtn onClick={this.subscribeFrequency}>
                    Join ~{activeFrequency}
                  </JoinBtn>)}

            {role === 'owner' &&
              <Icon
                onClick={this.editFrequency}
                icon="settings"
                subtle
                tipText="Frequency Settings"
                tipLocation="top-right"
              />}

            {(isEverything || role) &&
              <Everything>
                <span />
                {isEverything &&
                  <MenuButton everything onClick={this.showFrequenciesNav}>
                    <Icon icon="menu" />
                  </MenuButton>}

                <a onClick={this.jumpToTop}>{isEverything && '~Everything'}</a>

                <TipButton
                  onClick={this.toggleComposer}
                  tipText="New Story"
                  tipLocation="top-left"
                >
                  {composer.isOpen
                    ? <Icon icon="write-cancel" color="warn.alt" />
                    : <Icon icon="write" />}
                </TipButton>
              </Everything>}
          </Actions>
        </Header>

        <StoryList innerRef={comp => this.storyList = comp}>
          <Overlay active={composer.isOpen} />

          {/*canLoadNewStories &&
            <NewIndicator onClick={this.loadStoriesAgain}>
              <Icon icon="scroll-top" reverse />
              New stories!
            </NewIndicator>*/
          }

          {isNotifications && notifications.map(this.renderNotification)}

          {(isEverything || frequency) &&
            <InfiniteLoader
              isRowLoaded={() => true}
              loadMoreRows={() => Promise.resolve()}
              rowCount={stories.length}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  height={window.innerHeight - 50}
                  width={window.innerWidth > 768 ? 419 : window.innerWidth}
                  rowCount={stories.length}
                  rowRenderer={this.renderStory}
                  deferredMeasurementCache={this.state.cache}
                  rowHeight={this.state.cache.rowHeight}
                />
              )}
            </InfiniteLoader>}
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
    storiesLoaded: state.stories.loaded,
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(StoryMaster);
