import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ChatContainer,
  Bubble,
  ImgBubble,
  BubbleGroup,
  FromName,
  EmojiBubble,
  Messages,
  Avatar,
  HiddenLabel,
  Timestamp,
} from './style';
import * as Autolinker from 'autolinker';
import sanitizeHtml from 'sanitize-html';
import { getUsersFromMessageGroups } from '../../../helpers/stories';
import { onlyContainsEmoji, sortAndGroupBubbles } from '../../../helpers/utils';
import { FREQUENCY_ANCHORS, FREQUENCIES } from '../../../helpers/regexps';
import { openGallery } from '../../../actions/gallery';

class ChatView extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    if (this.props.messages) {
      this.fetchUsers();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.scrollToBottom();

    if (prevProps !== this.props && this.props.messages) {
      this.fetchUsers();
    }
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

  fetchUsers = () => {
    getUsersFromMessageGroups(this.props.messages).then(data => {
      this.setUsersData(data);
    });
  };

  setUsersData = data => {
    this.setState({
      users: data,
    });
  };

  render() {
    let { messages } = this.props;
    if (!messages) return <span />;

    const { users } = this.state;

    return (
      <ChatContainer>
        {messages.map((group, i) => {
          const itsaMe = group[0].userId === this.props.user.uid;
          const user = !itsaMe &&
            users &&
            users.find(user => user.uid === group[0].userId);
          const itsaRobo = group[0].userId === 'robo';
          if (itsaRobo) {
            let monthNames = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];
            let date = new Date(group[0].message.content);
            let day = date.getDate();
            let monthIndex = date.getMonth();
            let month = monthNames[monthIndex];
            let year = date.getFullYear();
            let hours = date.getHours();
            let cleanHours = hours > 12 ? hours - 12 : hours; // todo: support 24hr time
            let minutes = date.getMinutes();
            minutes = minutes >= 10 ? minutes : '0' + minutes.toString(); // turns 4 minutes into 04 minutes
            let ampm = hours >= 12 ? 'pm' : 'am'; // todo: support 24hr time
            return (
              <Timestamp key={i}>
                <span>
                  {month} {day}, {year} · {cleanHours}:{minutes}{ampm}
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
                <FromName>{user && user.name}</FromName>
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
