import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { openGallery } from '../../../actions/gallery';
import { StoryContainer, Header, StoryTitle, Byline } from './style';

class MessageGroupHeader extends Component {
  render() {
    let { messageGroup } = this.props;
    return (
      <StoryContainer>
        <Header>
          <StoryTitle>{messageGroup.creator}</StoryTitle>
        </Header>
      </StoryContainer>
    );
  }
}

export default MessageGroupHeader;
