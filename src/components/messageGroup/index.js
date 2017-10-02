import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../../components/icons';
import { convertTimestampToDate } from '../../helpers/utils';
import { NullState } from '../upsell';
import Badge from '../badges';

import {
  UserAvatar,
  AvatarLabel,
  Byline,
  Name,
  BubbleGroupContainer,
  Timestamp,
  Time,
  Container,
  MessagesWrapper,
} from './style';

const NullChat = () => (
  <NullState
    bg="chat"
    heading={`🔥 This thread is hot off the presses...`}
    copy={`Why don't you kick off the conversation?`}
  />
);
/*
  Messages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
class Messages extends Component {
  render() {
    const {
      messages,
      currentUser,
      toggleReaction,
      dispatch,
      threadType,
    } = this.props;

    const hash = window.location.hash.substr(1);
    const messagesExist = messages && messages.length !== 0;

    if (!messagesExist) {
      return <NullChat />;
    }

    const AuthorAvatar = props => {
      const { sender } = props;

      return (
        <AvatarLabel
          tipText={sender.name}
          tipLocation="right"
          style={{ alignSelf: 'flex-end' }}
        >
          <UserAvatar
            isOnline={sender.isOnline}
            src={sender.profilePhoto}
            username={sender.username}
            link={sender.username ? `/users/${sender.username}` : null}
          />
        </AvatarLabel>
      );
    };

    const AuthorByline = props => {
      const { me, sender } = props;

      return (
        <Byline>
          <Link to={`/users/${sender.username}`}>
            <Name>{me ? 'Me' : sender.name}</Name>
          </Link>
          {sender.isAdmin && <Badge type="admin" />}
          {sender.isPro && <Badge type="pro" />}
        </Byline>
      );
    };

    return (
      <Container>
        {messages.map((group, i) => {
          const evaluating = group[0];
          const roboText = evaluating.sender.id === 'robo';

          if (roboText) {
            const time = convertTimestampToDate(evaluating.message.content);
            return (
              <Timestamp border={'2px solid'} color={'bg.wash'} key={i}>
                <hr />
                <Time>{time}</Time>
                <hr />
              </Timestamp>
            );
          }

          const sender = evaluating.sender;
          const me = currentUser ? sender.id === currentUser.id : false;

          return (
            <BubbleGroupContainer key={i}>
              {!me && !roboText && <AuthorAvatar sender={sender} />}
              <MessagesWrapper>
                <AuthorByline sender={sender} me={me} />
                {group.map((message, i) => {
                  return (
                    <Message
                      imgSrc={imgSrc}
                      message={message}
                      link={link}
                      reaction={'like'}
                      me={me}
                      canModerate={canModerate}
                      hash={hash}
                      pending={pending}
                    />
                  );
                })}
              </MessagesWrapper>
            </BubbleGroupContainer>
          );
        })}
      </Container>
    );
  }
}

// get the current user from the store for evaulation of message bubbles
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
const ConnectedChatMessages = connect(mapStateToProps)(ChatMessages);

export default ConnectedChatMessages;
