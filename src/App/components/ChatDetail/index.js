import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ChatContainer, Bubble, ImgBubble, BubbleGroup, FromName } from './style';
import * as Autolinker from 'autolinker';
import sanitizeHtml from 'sanitize-html';
import actions from '../../../actions';

class ChatView extends Component {
  componentDidUpdate() {
    this.props.scrollToBottom()  
  }

  showGallery = (e) => {
    this.props.dispatch(actions.showGallery(e))
  }

  formatMessage(message) {
    if (!message) {
      return '';
    }
    let cleanMessage = sanitizeHtml(message);
    let linkedMessage = Autolinker.link(cleanMessage);
    return linkedMessage;
  }

  render() {
    let { messages } = this.props
    return (
      <ChatContainer>
        {messages &&
          messages.map((group, i) => {
            let me = this.props.user.uid;
            if (group[0].userId === me) {
              return (
                <BubbleGroup key={i} me>
                  {group.map((message, i) => {
                    if (message.message.type === "text") {
                      return (
                        <Bubble
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html: this.formatMessage(message.message.content),
                          }}
                        />
                      );
                    }

                    if (message.message.type === "media") {
                      return (
                        <ImgBubble 
                          me 
                          onClick={this.showGallery}
                          src={message.message.content} 
                          key={i} />
                      )
                    }
                  })}
                </BubbleGroup>
              );
            } else {
              return (
                <BubbleGroup key={i}>
                  <FromName>{group[0].userDisplayName}</FromName>
                  {group.map((message, i) => {
                    if (message.message.type === "text") {
                      return (
                        <Bubble
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html: this.formatMessage(message.message.content),
                          }}
                        />
                      );
                    }

                    if (message.message.type === "media") {
                      return (
                        <ImgBubble 
                          onClick={this.showGallery} 
                          src={message.message.content} 
                          key={i} />
                      )
                    }
                  })}
                </BubbleGroup>
              );
            }
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
  };
};

export default connect(mapStateToProps)(ChatView);
