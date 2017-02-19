import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ChatContainer, Bubble, BubbleGroup, FromName } from './style';
import * as Autolinker from 'autolinker';
import sanitizeHtml from 'sanitize-html';
import helpers from '../../../helpers'

class ChatView extends Component {
  constructor() {
    super()

    this.state = {
      users: []
    }
  }

  componentDidMount() {
    if (this.props.messages) {
      this.fetchUsers()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.scrollToBottom()

    if (prevProps !== this.props && this.props.messages) {
      this.fetchUsers()
    }
  }

  formatMessage(message) {
    if (!message) {
      return '';
    }
    let cleanMessage = sanitizeHtml(message);
    let linkedMessage = Autolinker.link(cleanMessage);
    return linkedMessage;
  }

  fetchUsers = () => {
    let messages = this.props.messages
    helpers.getUsersFromMessageGroups(this.props.messages).then(data => {
      this.setUsersData(data)
    })
  }

  setUsersData = (data) => {
    this.setState({
      users: data
    })
  }

  render() {
    let { messages } = this.props
    if (!messages) return <span />
    
    return (
      <ChatContainer>
        {messages.map((group, i) => {
          let me = this.props.user.uid;
          if (group[0].userId === me) {
            return (
              <BubbleGroup key={i} me>
                {group.map((message, i) => {
                  return (
                    <Bubble
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: this.formatMessage(message.message.content),
                      }}
                    />
                  );
                })}
              </BubbleGroup>
            );
          } else {
            return (
              <BubbleGroup key={i}>
                <FromName>
                  {this.state.users &&
                    this.state.users.map(user => {
                      if (user.uid === group[0].userId) {
                        return user.name
                      }
                    })
                  }
                </FromName>
                {group.map((message, i) => {
                  return (
                    <Bubble
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: this.formatMessage(message.message.content),
                      }}
                    />
                  );
                })}
              </BubbleGroup>
            );
          }
        })}
      </ChatContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    stories: state.stories,
    messages: state.messages.messages[state.stories.active],
  };
};

export default connect(mapStateToProps)(ChatView);
