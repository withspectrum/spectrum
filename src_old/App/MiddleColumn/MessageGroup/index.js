import React, { Component } from 'react';
import deepEqual from 'deep-eql';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import { setMessageGroupLastSeen } from '../../../db/messageGroups';
import { timeDifference } from '../../../helpers/utils';
import {
  MessageGroupContainer,
  MessageGroupImagesContainer,
  MessageGroupTextContainer,
  MessageGroupImage,
  MessageGroupByline,
  Usernames,
  Timestamp,
  Snippet,
} from './style';

class MessageGroup extends Component {
  shouldComponentUpdate = (nextProps: Object) => {
    return !deepEqual(nextProps, this.props);
  };

  setLastSeen = () => {
    const { user: { uid }, messageGroup: { id } } = this.props;
    setMessageGroupLastSeen(uid, id);
  };

  render() {
    const { messageGroup, link, user: { uid, list }, active } = this.props;

    // all participants in the chat
    const userIds = Object.keys(messageGroup.users);
    // everyone except currently viewing user
    const otherUsers = userIds.filter(user => user !== uid);
    const timestamp = timeDifference(Date.now(), messageGroup.last_activity);

    const isUnread =
      (messageGroup.last_activity > messageGroup.users[uid].last_seen &&
        !active) ||
      (!messageGroup.users[uid].last_seen && !active);

    return (
      <Card nomargin link={link}>
        <MessageGroupContainer
          active={this.props.active}
          onClick={this.setLastSeen}
        >
          <MessageGroupImagesContainer>
            {otherUsers.length === 1
              ? list[otherUsers]
                  ? <MessageGroupImage
                      unread={isUnread}
                      image={list[otherUsers].photoURL}
                    />
                  : <MessageGroupImage loading />
              : otherUsers.map((user, i) => {
                  const userObj = list[user];
                  if (userObj) {
                    return (
                      <MessageGroupImage
                        key={userObj.uid}
                        image={userObj.photoURL}
                      />
                    );
                  } else {
                    return <MessageGroupImage key={i} loading />;
                  }
                })}
          </MessageGroupImagesContainer>

          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames unread={isUnread}>
                {otherUsers.length === 1
                  ? list[otherUsers]
                      ? <p>{list[otherUsers].displayName}</p>
                      : <p>Loading...</p>
                  : otherUsers.map((user, i) => {
                      const userObj = list[user];
                      if (userObj) {
                        return <p key={userObj.uid}>{userObj.displayName}</p>;
                      } else {
                        return <p key={i}>Loading...</p>;
                      }
                    })}
              </Usernames>
              <Timestamp unread={isUnread}>{timestamp}</Timestamp>
            </MessageGroupByline>
            <Snippet unread={isUnread}>{messageGroup.snippet}</Snippet>
          </MessageGroupTextContainer>
        </MessageGroupContainer>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    messageGroups: state.messageGroups,
  };
};

export default connect(mapStateToProps)(MessageGroup);
