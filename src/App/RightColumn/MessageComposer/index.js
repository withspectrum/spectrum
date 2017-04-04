import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StoryContainer,
  Header,
  StoryTitle,
  Byline,
} from '../MessageGroupHeader/style';

class MessageComposer extends Component {
  render() {
    const { recipient } = this.props;

    return (
      <StoryContainer>
        <Header>
          <Byline>New Message</Byline>
          <StoryTitle>{recipient.displayName}</StoryTitle>
        </Header>
      </StoryContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    recipient: state.messageComposer.recipient,
  };
};

export default connect(mapStateToProps)(MessageComposer);
