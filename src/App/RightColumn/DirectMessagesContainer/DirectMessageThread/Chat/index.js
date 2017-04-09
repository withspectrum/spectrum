//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';

import {
  onlyContainsEmoji,
  convertTimestampToDate,
} from '../../../../../helpers/utils';
import { openModal } from '../../../../../actions/modals';
import { openGallery } from '../../../../../actions/gallery';
import { track } from '../../../../../EventTracker';
import Badge from '../../../../../shared/Badge';
import { Bubble, EmojiBubble, ImgBubble } from './bubbles';

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
} from './style';

class Chat extends Component {
  static defaultProps = {
    messages: React.PropTypes.array.isRequired,
    usersList: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,
  };

  openGallery = e => {
    this.props.dispatch(openGallery(e));
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
    const { usersList }: Object = this.props;
    const user = usersList[group.userId];
    const isAdmin = this.isAdmin(user.uid);
    const isPro = this.isPro(user.uid);

    return (
      <Byline me={me}>
        <Name onClick={() => this.openUserProfileModal(user.uid)}>
          {me ? 'You' : user.displayName}
        </Name>
        {isAdmin && <Badge type="admin" />}
        {isPro &&
          <Badge
            type="pro"
            tipText="Beta Supporter"
            tipLocation="top-right"
            onClick={this.handleProClick}
          />}
      </Byline>
    );
  };

  render() {
    const { messages, usersList, currentUser } = this.props;

    return (
      <Container>
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
                      <TextBubble
                        key={message.id}
                        me={me}
                        persisted={message.persisted}
                        sender={sender}
                        message={message.message}
                      />
                    );
                  } else if (message.message.type === 'media') {
                    return (
                      <ImgBubble
                        key={message.id}
                        openGallery={this.openGallery}
                        me={me}
                        persisted={message.persisted}
                        sender={sender}
                        imgSrc={message.message.content.url}
                        message={message.message}
                      />
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
