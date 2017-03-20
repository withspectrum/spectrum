import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ChatContainer,
  Bubble,
  ImgBubble,
  BubbleGroup,
  Byline,
  AdminBadge,
  EmojiBubble,
  Messages,
  Avatar,
  HiddenLabel,
  Timestamp,
} from './style';
import * as Autolinker from 'autolinker';
import sanitizeHtml from 'sanitize-html';
import {
  onlyContainsEmoji,
  sortAndGroupBubbles,
  convertTimestampToDate,
} from '../../../../helpers/utils';
import { FREQUENCY_ANCHORS, FREQUENCIES } from '../../../../helpers/regexps';
import { openGallery } from '../../../../actions/gallery';

class ChatView extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.props.contextualScrollToBottom();
  }

  openGallery = e => {
    this.props.dispatch(openGallery(e));
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
          const isStoryCreator = this.props.story.creator.uid ===
            group[0].userId;
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
                  <Avatar src={user.photoURL} />
                </HiddenLabel>}
              <Messages>
                <Byline op={isStoryCreator}>
                  {user && user.displayName}
                  {!itsaMe &&
                    isAdmin &&
                    <AdminBadge op={isStoryCreator}>Admin</AdminBadge>}
                </Byline>
                {group.map((message, i) => {
                  // mxstbr: The "emoji" specific type is legacy, remove in the future
                  if (
                    message.message.type === 'text' ||
                    message.message.type === 'emoji'
                  ) {
                    let TextBubble = onlyContainsEmoji(message.message.content)
                      ? EmojiBubble
                      : Bubble;
                    return (
                      <TextBubble
                        key={i}
                        me={itsaMe}
                        persisted={message.persisted}
                        dangerouslySetInnerHTML={{
                          __html: this.formatMessage(message.message.content),
                        }}
                      />
                    );
                  }

                  if (message.message.type === 'media') {
                    return (
                      <ImgBubble
                        me={itsaMe}
                        onClick={this.openGallery}
                        persisted={message.persisted}
                        src={message.message.content.url}
                        key={i}
                      />
                    );
                  }

                  return null;
                })}
              </Messages>
            </BubbleGroup>
          );
        })}

      </ChatContainer>
    );
  }
}

const mapStateToProps = state => {
  const messages = state.messages.messages.filter(
    message => message.storyId === state.stories.active,
  );
  return {
    user: state.user,
    stories: state.stories,
    messages: sortAndGroupBubbles(messages),
  };
};

export default connect(mapStateToProps)(ChatView);
