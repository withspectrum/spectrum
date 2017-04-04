import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ChatContainer,
  BubbleWrapper,
  Bubble,
  ImgBubble,
  BubbleGroup,
  Reaction,
  Count,
  Byline,
  AdminBadge,
  ProBadge,
  EmojiBubble,
  Messages,
  Avatar,
  HiddenLabel,
  Timestamp,
  ScrollButton,
} from './style';
import * as Autolinker from 'autolinker';
import sanitizeHtml from 'sanitize-html';
import {
  onlyContainsEmoji,
  sortAndGroupBubbles,
  convertTimestampToDate,
} from '../../../helpers/utils';
import { FREQUENCY_ANCHORS, FREQUENCIES } from '../../../helpers/regexps';
import { openGallery } from '../../../actions/gallery';
import { addReaction, removeReaction } from '../../../actions/messages';
import { openModal } from '../../../actions/modals';
import { track } from '../../../EventTracker';
import Icon from '../../../shared/Icons';

class Chat extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.props.contextualScrollToBottom();

    // TODO: Not working properly
    if (this.props.shouldScrollToBottomOnRender) {
      this.props.forceScrollToBottom();
    }
  }

  openGallery = e => {
    this.props.dispatch(openGallery(e));
  };

  forceScroll = () => {
    this.props.forceScrollToBottom();
  };

  formatMessage(message) {
    if (!message) {
      return '';
    }
    const cleanMessage = sanitizeHtml(message);
    // Replace "~frequency" with "spectrum.chat/~frequency" to get
    // autolinker to link it
    const linkedMessage = Autolinker.link(
      cleanMessage.replace(FREQUENCIES, '$1https://spectrum.chat/$2'),
    );
    // Remove the "spectrum.chat" part from the link text so in the message
    // you just see "~frequency", but it's linked to the frequency
    return linkedMessage.replace(FREQUENCY_ANCHORS, '>$1</a>');
  }

  toggleReaction = (messageId, userHasReacted) => {
    if (userHasReacted) {
      this.props.dispatch(removeReaction(messageId));
    } else {
      this.props.dispatch(addReaction(messageId));
    }
  };

  handleProClick = () => {
    const { user } = this.props;

    // if user isn't signed in, they shouldn't see a pro modal
    if (!user.uid) return;

    // otherwise if they aren't subscribed, show the modal
    if (!user.subscriptions || !user.subscriptions) {
      track('upgrade', 'inited', 'chat badge');

      this.props.dispatch(openModal('UPGRADE_MODAL', user));
    }
  };

  openUserProfileModal = e => {
    const user = e.target.id;

    this.props.dispatch(openModal('USER_PROFILE_MODAL', { user: user }));
  };

  render() {
    let { messages, user: { list } } = this.props;
    if (!messages) return <span />;

    return (
      <ChatContainer>
        {messages.map((group, i) => {
          const itsaMe = group[0].userId === this.props.user.uid;
          const user = !itsaMe && list[group[0].userId];
          const admins = [
            'VToKcde16dREgDkXcDl3hhcrFN33',
            'gVk5mYwccUOEKiN5vtOouqroGKo1',
            '01p2A7kDCWUjGj6zQLlMQUOSQL42',
          ];
          const isAdmin = admins.includes(group[0].userId);
          const isPro = list[group[0].userId]
            ? list[group[0].userId].subscriptions
                ? list[group[0].userId].subscriptions
                : false
            : false;
          let isStoryCreator;
          if (this.props.story) {
            isStoryCreator = this.props.story.creator.uid === group[0].userId;
          }
          const itsaRobo = group[0].userId === 'robo';
          if (itsaRobo) {
            let time = convertTimestampToDate(group[0].message.content);
            return (
              <Timestamp key={i}>
                <span>
                  {time}
                </span>
              </Timestamp>
            );
          }

          return (
            <BubbleGroup key={i} me={itsaMe}>
              {user &&
                !itsaMe &&
                <HiddenLabel tipText={user.name} tipLocation="right">
                  <Avatar
                    id={user.uid}
                    onClick={this.openUserProfileModal}
                    src={user.photoURL}
                  />
                </HiddenLabel>}
              <Messages>
                <Byline op={isStoryCreator}>
                  <span id={user.uid} onClick={this.openUserProfileModal}>
                    {user && user.displayName}
                  </span>
                  {!itsaMe &&
                    isAdmin &&
                    <AdminBadge op={isStoryCreator}>Admin</AdminBadge>}
                  {!itsaMe &&
                    isPro &&
                    <ProBadge
                      tipText={'Beta Supporter'}
                      tipLocation="top-right"
                      onClick={this.handleProClick}
                    >
                      PRO
                    </ProBadge>}
                </Byline>
                {group.map((message, i) => {
                  let reactionUsers = message.reactions
                    ? Object.keys(message.reactions)
                    : null;
                  let reactionCount = message.reactions
                    ? reactionUsers.length
                    : 0;
                  let userHasReacted = reactionUsers &&
                    reactionUsers.includes(this.props.user.uid);
                  // mxstbr: The "emoji" specific type is legacy, remove in the future
                  if (
                    message.message.type === 'text' ||
                    message.message.type === 'emoji'
                  ) {
                    let emojiOnly = onlyContainsEmoji(message.message.content);
                    let TextBubble = emojiOnly ? EmojiBubble : Bubble;

                    return (
                      <BubbleWrapper key={message.id} me={itsaMe}>
                        <TextBubble
                          key={i}
                          me={itsaMe}
                          persisted={message.persisted}
                          dangerouslySetInnerHTML={{
                            __html: this.formatMessage(message.message.content),
                          }}
                        />
                        {emojiOnly ||
                          <Reaction
                            hasCount={reactionCount}
                            active={userHasReacted}
                            me={itsaMe}
                            hide={
                              (itsaMe || this.props.user.uid === null) &&
                                reactionCount === 0
                            }
                            onClick={
                              itsaMe
                                ? () => this.doNothing
                                : () =>
                                    this.toggleReaction(
                                      message.id,
                                      userHasReacted,
                                    )
                            }
                          >
                            <Icon
                              icon={'like-active'}
                              reverse
                              size={16}
                              static
                            />
                            <Count>{reactionCount}</Count>
                          </Reaction>}
                      </BubbleWrapper>
                    );
                  }

                  if (message.message.type === 'media') {
                    return (
                      <BubbleWrapper key={message.id} me={itsaMe}>
                        <ImgBubble
                          me={itsaMe}
                          onClick={this.openGallery}
                          persisted={message.persisted}
                          src={message.message.content.url}
                          key={i}
                        />

                        <Reaction
                          hasCount={reactionCount}
                          active={userHasReacted}
                          me={itsaMe}
                          hide={
                            (itsaMe || this.props.user.uid) &&
                              reactionCount === 0
                          }
                          onClick={
                            itsaMe
                              ? () => this.doNothing
                              : () =>
                                  this.toggleReaction(
                                    message.id,
                                    userHasReacted,
                                  )
                          }
                        >
                          <Icon icon={'like-active'} reverse size={16} static />
                          <Count className={'count'}>{reactionCount}</Count>
                        </Reaction>
                      </BubbleWrapper>
                    );
                  }

                  return null;
                })}
              </Messages>
            </BubbleGroup>
          );
        })}
        {messages &&
          messages.length > 20 &&
          <ScrollButton
            atBottom={this.props.atBottom}
            onClick={this.forceScroll}
          >
            <Icon icon="scroll-bottom" reverse static />
            <span>Jump to latest</span>
          </ScrollButton>}
      </ChatContainer>
    );
  }
}

const mapStateToProps = state => {
  let messages;
  if (state.stories.active) {
    messages = state.messages.messages.filter(
      message => message.storyId === state.stories.active,
    );
  }

  if (state.messageGroups.active) {
    messages = state.messages.messages.filter(
      message => message.messageGroupId === state.messageGroups.active,
    );
  }

  return {
    user: state.user,
    stories: state.stories,
    messages: sortAndGroupBubbles(messages),
  };
};

export default connect(mapStateToProps)(Chat);
