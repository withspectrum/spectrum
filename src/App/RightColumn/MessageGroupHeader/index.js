import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { openGallery } from '../../../actions/gallery';
import { StoryContainer, Header, StoryTitle, Byline } from './style';

class MessageGroupHeader extends Component {
  render() {
    let { messageGroup, user: { uid, list } } = this.props;
    // all participants in the chat
    const userIds = Object.keys(messageGroup.users);
    // everyone except currently viewing user
    const otherUsers = userIds.filter(user => user !== uid);
    console.log(list, otherUsers);

    return (
      <StoryContainer>
        <Header>
          {list[otherUsers]
            ? <StoryTitle>{list[otherUsers].displayName}</StoryTitle>
            : <StoryTitle>Loading...</StoryTitle>}
        </Header>
      </StoryContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(MessageGroupHeader);
