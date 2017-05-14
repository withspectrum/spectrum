// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { Route } from 'react-router';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import { getCurrentUserDirectMessageGroups } from './queries';
import { Button } from '../../components/buttons';
import { displayLoadingScreen } from '../../components/loading';
import GroupsList from './components/groupsList';
import Messages from './components/messages';
import ChatInput from '../../components/chatInput';
import { View, MessagesList, MessagesContainer } from './style';

const DirectMessagesChat = ({ match, currentUser }) => {
  if (match.params.threadId !== 'new') {
    return (
      <div>
        <Messages id={match.params.threadId} currentUser={currentUser} />
        <ChatInput thread={match.params.threadId} />
      </div>
    );
  } else {
    return <div />;
  }
};

const DirectMessageComposer = ({ currentUser }) => <div>New Message!</div>;

class DirectMessages extends Component {
  render() {
    const { match, currentUser, data: { directMessages } } = this.props;
    const groups = directMessages.map(group => group.node);

    return (
      <View>
        <MessagesList>
          <Link to="/messages/new"><Button>New Message</Button></Link>
          <GroupsList groups={groups} currentUser={currentUser} />
        </MessagesList>

        <MessagesContainer>
          <Route
            path={`${match.url}/new`}
            component={DirectMessageComposer}
            currentUser={currentUser}
          />

          <Route
            path={`${match.url}/:threadId`}
            component={DirectMessagesChat}
            currentUser={currentUser}
          />
        </MessagesContainer>
      </View>
    );
  }
}

const DirectMessagesWithQuery = compose(
  getCurrentUserDirectMessageGroups,
  displayLoadingScreen,
  pure
)(DirectMessages);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(DirectMessagesWithQuery);
