//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';

import {
  onlyContainsEmoji,
  convertTimestampToDate,
} from '../../../../helpers/utils';
import { openModal } from '../../../../actions/modals';
import { openGallery } from '../../../../actions/gallery';
import { addReaction, removeReaction } from '../../../../actions/messages';
import { track } from '../../../../EventTracker';
import Badge from '../../../../shared/Badge';
import Icon from '../../../../shared/Icons';
import { Bubble, EmojiBubble, ImgBubble } from '../Bubbles';
import { Reaction, Count } from '../Bubbles/style';

import {
  Avatar,
  AvatarLabel,
  Byline,
  Name,
  BubbleGroupContainer,
  Timestamp,
  Time,
  Container,
  MessagesWrapper,
  MessageWrapper,
} from './style';

class Chat extends Component {
  static defaultProps = {
    messages: React.PropTypes.array.isRequired,
    usersList: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,
    forceScrollToBottom: React.PropTypes.bool,
    activeCommunity: React.PropTypes.string,
  };

  openGallery = e => {
    this.props.dispatch(openGallery(e));
  };

  toggleReaction = (messageId: string, userHasReacted: boolean) => {
    if (userHasReacted) {
      this.props.dispatch(removeReaction(messageId));
    } else {
      this.props.dispatch(addReaction(messageId));
    }
  };

  handleProClick = () => {
    const { currentUser } = this.props;

    if (!currentUser.uid) return;
    if (!this.isPro(currentUser.uid)) {
      track('upgrade', 'inited', 'chat badge');
      this.props.dispatch(openModal('UPGRADE_MODAL', currentUser));
    }
  };

  openUserProfileModal = (user: string) => {
    this.props.dispatch(openModal('USER_PROFILE_MODAL', { user }));
  };

  renderAvatar = (sender: Object, me: boolean) => {
    if (me) return;

    return (
      <AvatarLabel tipText={sender.displayName} tipLocation="right">
        <Avatar
          onClick={() => this.openUserProfileModal(sender.uid)}
          src={sender.photoURL}
        />
      </AvatarLabel>
    );
  };

  isPro = (userId: string) => {
    const { usersList } = this.props;
    // TODO: Actually check for pro plan
    return usersList[userId].subscriptions ? true : false;
  };

  isAdmin = (userId: string) => {
    const adminIds = [
      'VToKcde16dREgDkXcDl3hhcrFN33',
      'gVk5mYwccUOEKiN5vtOouqroGKo1',
      '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    ];

    return adminIds.includes(userId);
  };

  renderBubbleHeader = (group: Object, me: boolean) => {
    const { usersList, type }: Object = this.props;
    const user = usersList[group.userId];
    const isAdmin = this.isAdmin(user.uid);
    const isPro = this.isPro(user.uid);

    // if type !== 'story' we don't show admin or pro badges because it clutters group messages
    return (
      <Byline me={me}>
        <Name onClick={() => this.openUserProfileModal(user.uid)}>
          {me ? 'You' : user.displayName}
        </Name>
        {isAdmin && type === 'story' && <Badge type="admin" />}
        {isPro &&
          type === 'story' &&
          <Badge
            type="pro"
            tipText="Beta Supporter"
            tipLocation="top-right"
            onClick={() => this.handleProClick()}
          />}
      </Byline>
    );
  };

  renderReaction = (
    message: Object,
    sender: Object,
    me: boolean,
  ): React$Element<any> => {
    const { currentUser } = this.props;

    let reactionUsers = message.reactions
      ? Object.keys(message.reactions)
      : null;
    let reactionCount = message.reactions ? reactionUsers.length : 0;
    let userHasReacted = reactionUsers &&
      reactionUsers.includes(currentUser.uid);

    return (
      <Reaction
        hasCount={reactionCount}
        active={userHasReacted}
        me={me}
        hide={(me || currentUser.uid === null) && reactionCount === 0}
        onClick={
          me
            ? () => this.doNothing
            : () => this.toggleReaction(message.id, userHasReacted)
        }
      >
        <Icon icon={'like-active'} reverse size={16} static />
        <Count>{reactionCount}</Count>
      </Reaction>
    );
  };

  render() {
    const {
      messages,
      usersList,
      currentUser,
      type,
      activeCommunity,
    } = this.props;

    return (
      <Container innerRef={scrollBody => this.scrollBody = scrollBody}>
        {messages.map((group, i) => {
          const evaluating = group[0];
          const roboText = evaluating.userId === 'robo';

          if (roboText) {
            const time = convertTimestampToDate(evaluating.message.content);
            return (
              <Timestamp key={i}>
                <Time>{time}</Time>
              </Timestamp>
            );
          }

          const sender = usersList[evaluating.userId];
          const me = sender.uid === currentUser.uid;

          return (
            <BubbleGroupContainer me={me} key={i}>
              {this.renderAvatar(sender, me)}

              <MessagesWrapper>
                {this.renderBubbleHeader(evaluating, me)}
                {group.map((message, i) => {
                  if (
                    message.message.type === 'text' ||
                    message.message.type === 'emoji'
                  ) {
                    const emojiOnly = onlyContainsEmoji(
                      message.message.content,
                    );
                    const TextBubble = emojiOnly ? EmojiBubble : Bubble;
                    return (
                      <MessageWrapper me={me} key={message.id}>
                        <TextBubble
                          me={me}
                          persisted={message.persisted}
                          sender={sender}
                          message={message.message}
                          type={type}
                          activeCommunity={activeCommunity}
                        />

                        {!emojiOnly && this.renderReaction(message, sender, me)}
                      </MessageWrapper>
                    );
                  } else if (message.message.type === 'media') {
                    return (
                      <MessageWrapper me={me} key={message.id}>
                        <ImgBubble
                          openGallery={this.openGallery}
                          me={me}
                          persisted={message.persisted}
                          sender={sender}
                          imgSrc={message.message.content.url}
                          message={message.message}
                        />
                        {this.renderReaction(message, sender, me)}
                      </MessageWrapper>
                    );
                  }
                })}
              </MessagesWrapper>
            </BubbleGroupContainer>
          );
        })}
      </Container>
    );
  }
}

export default connect()(Chat);
