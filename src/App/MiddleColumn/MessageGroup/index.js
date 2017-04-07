import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import deepEqual from 'deep-eql';
import { getUserInfo } from '../../../db/users';
import { setMessageGroupLastSeen } from '../../../db/messageGroups';
import { timeDifference, arrayToHash } from '../../../helpers/utils';
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
  render() {
    const { messageGroup, link, user: { uid, list }, active } = this.props;

    // all participants in the chat
    const userIds = Object.keys(messageGroup.users);
    // everyone except currently viewing user
    const otherUsers = userIds.filter(user => user !== uid);
    const timestamp = timeDifference(Date.now(), messageGroup.last_activity);

    const isUnread = messageGroup.last_activity >
      messageGroup.users[uid].last_seen &&
      !active;

    return (
      <Card nomargin link={link}>
        <MessageGroupContainer active={this.props.active}>
          <MessageGroupImagesContainer>
            {otherUsers.length === 1
              ? list[otherUsers]
                  ? <MessageGroupImage image={list[otherUsers].photoURL} />
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
