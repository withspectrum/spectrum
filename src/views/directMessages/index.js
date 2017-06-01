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
import { displayLoadingState } from './components/loading';
import ThreadsList from './components/threadsList';
import NewThread from './containers/newThread';
import ExistingThread from './containers/existingThread';
import { View, MessagesList, ComposeHeader } from './style';
import Titlebar from '../titlebar';

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
    const { match, history, currentUser, data } = this.props;
    const width = window.innerWidth;
    const isMobile = width < 768;

    if (match.isExact && !isMobile) {
      history.push('/messages/new');
    }

    const { activeThread } = this.state;

    // no user found, get them to the home page to log in
    if (!data.user) {
      window.location.href = '/';
    }

    // if user has no dm threads, make sure they stay on /new
    if (
      data.user && data.user.directMessageThreadsConnection.edges.length === 0
    ) {
      return (
        <View>
          {isMobile && <Titlebar title={'Messages'} provideBack={false} />}

          <MessagesList>
            <Link to="/messages/new">
              <ComposeHeader>
                <Icon glyph="message-new" />
              </ComposeHeader>
            </Link>
          </MessagesList>

          <Route render={() => <Redirect to="/messages/new" />} />
        </View>
      );
    }

    const threads = data.user.directMessageThreadsConnection.edges.map(
      thread => thread.node
    );

    return (
      <View>
        {isMobile &&
          <Titlebar title={'Messages'} provideBack={false} noComposer />}

        <MessagesList>
          <Link to="/messages/new">
            <ComposeHeader>
              <Icon glyph="message-new" />
            </ComposeHeader>
          </Link>
          <ThreadsList
            active={activeThread}
            threads={threads}
            currentUser={currentUser}
          />
        </MessagesList>

        {/*
          pass the user's existing DM threads into the composer so that we can more quickly
          determine if the user is creating a new thread or has typed the names that map
          to an existing DM thread
         */}
        <Route
          path={`${match.url}/new`}
          render={props => (
            <NewThread {...props} threads={threads} currentUser={currentUser} />
          )}
        />

        {/*
          if a thread is being viewed and the threadId !== 'new', pass the
          threads down the tree to fetch the messages for the urls threadId
         */}
        <Route
          path={`${match.url}/:threadId`}
          render={props => (
            <ExistingThread
              {...props}
              threads={threads}
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
  displayLoadingState,
  pure
)(DirectMessages);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(DirectMessagesWithQuery);
