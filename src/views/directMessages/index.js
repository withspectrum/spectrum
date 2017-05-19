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
import {
  getCurrentUserDirectMessageThreads,
} from '../../api/directMessageThread';
import Icon from '../../components/icons';
import { displayLoadingScreen } from '../../components/loading';
import ThreadsList from './components/groupsList';
import NewThread from './containers/newThread';
import ExistingThread from './containers/existingThread';
import { View, MessagesList, ComposeHeader } from './style';

class DirectMessages extends Component {
  state: {
    activeThread: string,
  };

  constructor() {
    super();

    this.state = {
      activeThread: '',
    };
  }

  setActiveThread = id => {
    this.setState({
      activeThread: id,
    });
  };

  render() {
    const { match, currentUser, data } = this.props;
    console.log('dm thread', data);
    const { activeThread } = this.state;
    const groups = data.user.directMessageThreadsConnection.edges.map(
      group => group.node
    );

    return (
      <View>
        <MessagesList>
          <Link to="/messages/new">
            <ComposeHeader>
              <Icon color={'brand.default'} glyph="write" size={32} />
            </ComposeHeader>
          </Link>
          <ThreadsList
            active={activeThread}
            groups={groups}
            currentUser={currentUser}
          />
        </MessagesList>

        {/* if no threadId is provided, redirect to homepage */}
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
              groups={groups}
              currentUser={currentUser}
              setActiveThread={this.setActiveThread}
            />
          )}
        />
      </View>
    );
  }
}

const DirectMessagesWithQuery = compose(
  getCurrentUserDirectMessageThreads,
  displayLoadingScreen,
  pure
)(DirectMessages);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(DirectMessagesWithQuery);
