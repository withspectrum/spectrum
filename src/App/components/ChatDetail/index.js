import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { ChatContainer, BubbleGroup, FromName } from './style';
import Bubble from '../Bubble';
import { getUsersFromMessageGroups } from '../../../helpers/stories';
import { sortAndGroupBubbles } from '../../../helpers/utils';

class ChatView extends Component {
  constructor() {
    super();

    this.bubbles = [];
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

  fetchUsers = () => {
    let messages = sortAndGroupBubbles(this.props.messages);
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
        {sortAndGroupBubbles(messages).map((group, i) => {
          const itsaMe = group[0].userId === this.props.user.uid;
          const user = !itsaMe &&
            users &&
            users.find(user => user.uid === group[0].userId);
          return (
            <BubbleGroup key={i} me={itsaMe}>
              <FromName>{user && user.name}</FromName>
              {group.map(({ message, id }, index) => (
                <Bubble
                  key={`bubble-${i}/${index}`}
                  ref={comp => {
                    this.bubbles.push(comp);
                  }}
                  // The id is needed in checkLastUnreadBubble above, do not remove
                  id={id}
                  content={message.content}
                  type={message.type}
                  me={itsaMe}
                />
              ))}
            </BubbleGroup>
          );
        })}
      </ChatContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    stories: state.stories,
    messages: state.messages.messages[state.stories.active],
    lastRead: state.user.lastRead[state.stories.active],
  };
};

export default connect(mapStateToProps)(ChatView);
