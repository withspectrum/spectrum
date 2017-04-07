import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { openGallery } from '../../../actions/gallery';
import { throttle } from '../../../helpers/utils';
import { setMessageGroupLastSeen } from '../../../db/messageGroups';
import { StoryContainer, Header, StoryTitle, Byline } from './style';

class MessageGroupHeader extends Component {
  componentDidMount() {
    const { messageGroup, user: { uid } } = this.props;
    setMessageGroupLastSeen(uid, messageGroup.id);
  }

  componentDidUpdate(nextProps) {
    const { messageGroup, user: { uid } } = nextProps;
    if (nextProps.messageGroup.id !== this.props.messageGroup.id) {
      setMessageGroupLastSeen(uid, messageGroup.id);
    }
  }

  render() {
    const { messageGroup, user: { uid, list } } = this.props;
    // all participants in the chat
    const userIds = Object.keys(messageGroup.users);
    // everyone except currently viewing user
    const otherUsers = userIds.filter(user => user !== uid);

    return (
      <StoryContainer>
        <Byline>Message with</Byline>
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
