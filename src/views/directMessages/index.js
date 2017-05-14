// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { Route } from 'react-router';
// $FlowFixMe
import { connect } from 'react-redux';
import { getCurrentUserDirectMessageGroups } from './queries';
import AppViewWrapper from '../../components/appViewWrapper';
import { displayLoadingScreen } from '../../components/loading';
import GroupsList from './components/groupsList';
import Messages from './components/messages';
import {
  ScrollContainer,
  View,
  MessagesList,
  MessagesContainer,
} from './style';

const DirectMessagesChat = ({ match, currentUser }) => (
  <Messages id={match.params.threadId} currentUser={currentUser} />
);

class DirectMessages extends Component {
  render() {
    const { match, currentUser, data: { directMessages, error } } = this.props;
    const groups = directMessages.map(group => group.node);

    return (
      <View>
        <MessagesList>
          <GroupsList groups={groups} />
        </MessagesList>

        <MessagesContainer>
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
