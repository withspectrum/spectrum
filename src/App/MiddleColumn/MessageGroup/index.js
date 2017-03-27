import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import { getUserInfo } from '../../../db/users';
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
  componentDidMount = () => {
    const { messageGroup, user: { list } } = this.props;
    const userIds = Object.keys(messageGroup.users);

    // we need to populate the user list in store if a user visits /messages directly
    Promise.all(userIds.map(user => getUserInfo(user))).then(users => {
      let formattedUsers = {};

      users.map((user, i) => {
        formattedUsers[user.uid] = user;
      });

      this.props.dispatch({
        type: 'ADD_USERS_TO_LIST',
        users: formattedUsers,
      });
    });
  };

  render() {
    const { messageGroup, link, user: { uid, list }, active } = this.props;

    // all participants in the chat
    const userIds = Object.keys(messageGroup.users);
    // everyone except currently viewing user
    const otherUsers = userIds.filter(user => user !== uid);
    const timestamp = timeDifference(Date.now(), messageGroup.last_activity);

    return (
      <Card link={link}>
        <MessageGroupContainer active={this.props.active}>
          <MessageGroupImagesContainer>
            {otherUsers.length === 1
              ? list[otherUsers]
                  ? <MessageGroupImage image={list[otherUsers].photoURL} />
                  : <MessageGroupImage loading />
              : otherUsers.map(user => {
                  const userObj = list[user];
                  if (userObj) {
                    return <MessageGroupImage image={userObj.photoURL} />;
                  } else {
                    return <MessageGroupImage loading />;
                  }
                })}
          </MessageGroupImagesContainer>

          <MessageGroupTextContainer>
            <MessageGroupByline>
              <Usernames>
                {otherUsers.length === 1
                  ? list[otherUsers]
                      ? <p>{list[otherUsers].displayName}</p>
                      : <p>Loading...</p>
                  : otherUsers.map(user => {
                      const userObj = list[user];
                      if (userObj) {
                        return <p>{userObj.displayName}</p>;
                      } else {
                        return <p>Loading...</p>;
                      }
                    })}
              </Usernames>
              <Timestamp>{timestamp}</Timestamp>
            </MessageGroupByline>
            <Snippet>{messageGroup.snippet}</Snippet>
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
