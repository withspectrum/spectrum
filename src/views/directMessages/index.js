// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { Route } from 'react-router';
import { getCurrentUserDirectMessageGroups } from './queries';
import AppViewWrapper from '../../components/appViewWrapper';
import { displayLoadingScreen } from '../../components/loading';
import GroupsList from './components/groupsList';
import { ScrollContainer, View, MessagesList, Messages } from './style';

const DirectMessagesChat = ({ match }) => <div>{match.params.threadId}</div>;

class DirectMessages extends Component {
  render() {
    const { match, location, data: { directMessages, error } } = this.props;
    const groups = directMessages.map(group => group.node);

    return (
      <View>
        <MessagesList>
          <GroupsList groups={groups} />
        </MessagesList>

        <Messages>
          <Route
            path={`${match.url}/:threadId`}
            component={DirectMessagesChat}
          />
        </Messages>
      </View>
    );
  }
}

export default compose(
  getCurrentUserDirectMessageGroups,
  displayLoadingScreen,
  pure
)(DirectMessages);
