// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { Route, Redirect } from 'react-router';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import { getCurrentUserDirectMessageGroups } from './queries';
import Icon from '../../components/icons';
import { displayLoadingScreen } from '../../components/loading';
import GroupsList from './components/groupsList';
import Messages from './components/messages';
import Composer from './components/composer';
import Header from './components/header';
import ChatInput from '../../components/chatInput';
import { View, MessagesList, MessagesContainer, ComposeHeader } from './style';

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

const DirectMessagesChat = ({ match, currentUser, groups }) => {
  if (match.params.threadId !== 'new') {
    const group = groups.filter(
      group => group.node.id === match.params.threadId
    )[0].node;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          minHeight: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            overflowY: 'scroll',
            flexDirection: 'column',
            flex: '1',
          }}
        >
          <Header group={group} currentUser={currentUser} />
          <Messages id={match.params.threadId} currentUser={currentUser} />
        </div>
        <ChatInput thread={match.params.threadId} />
      </div>
    );
  } else {
    return <div />;
  }
};

const DirectMessageChatWithCurrentUser = connect(mapStateToProps)(
  DirectMessagesChat
);

class DirectMessages extends Component {
  render() {
    const { match, currentUser, data: { directMessages } } = this.props;
    const groups = directMessages.map(group => group.node);

    return (
      <View>
        <MessagesList>
          <Link to="/messages/new">
            <ComposeHeader>
              <Icon color={'brand.default'} glyph="write" size={32} />
            </ComposeHeader>
          </Link>
          <GroupsList groups={groups} currentUser={currentUser} />
        </MessagesList>

        <MessagesContainer>
          {/* if no storyId is provided, redirect to homepage */}
          <Route
            exact
            path={match.url}
            render={() => <Redirect to="/messages/new" />}
          />
          {/*
            pass the user's existing DM groups into the composer so that we can more quickly
            determine if the user is creating a new group or has typed the names that map
            to an existing DM thread
           */}
          <Route
            path={`${match.url}/new`}
            render={props => <Composer {...props} groups={groups} />}
          />

          <Route
            path={`${match.url}/:threadId`}
            render={props => (
              <DirectMessageChatWithCurrentUser
                {...props}
                groups={directMessages}
              />
            )}
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

export default connect(mapStateToProps)(DirectMessagesWithQuery);
