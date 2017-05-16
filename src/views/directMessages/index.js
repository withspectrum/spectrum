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
import Header from './components/header';
import NewThread from './containers/newThread';
import ExistingThread from './containers/existingThread';
import { View, ViewContent, MessagesList, ComposeHeader } from './style';

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
          render={props => (
            <NewThread {...props} groups={groups} currentUser={currentUser} />
          )}
        />

        {/*
          if a thread is being viewed and the threadId !== 'new', pass the
          groups down the tree to fetch the messages for the urls threadId
         */}
        <Route
          path={`${match.url}/:threadId`}
          render={props => (
            <ExistingThread
              {...props}
              groups={directMessages}
              currentUser={currentUser}
            />
          )}
        />
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
