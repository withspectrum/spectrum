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

    const { activeThread } = this.state;

    // no user found, get them to the home page to log in
    if (!data.user) {
      window.location.href = '/';
    }

    const threads = data.user.directMessageThreadsConnection.edges.map(
      thread => thread.node
    );

    // if the user is on a phone, only render one view column at a time
    if (isMobile) {
      // if there's a threadId, that column should be a threadDetail
      if (match.params.threadId) {
        return (
          <View>
            <Titlebar
              title={'Messages'}
              provideBack={true}
              backRoute={'/messages'}
              noComposer
            />
            <ExistingThread
              match={match}
              threads={threads}
              currentUser={currentUser}
              setActiveThread={this.setActiveThread}
            />
          </View>
        );
      } else if (match.url === '/messages/new' && match.isExact) {
        // if they're in the newMessage flow, it should be the composer
        return (
          <View>
            <Titlebar title={'Messages'} provideBack={true} noComposer />
            <NewThread threads={threads} currentUser={currentUser} />
          </View>
        );
      } else {
        //if it's not one of those, it should return the messages list
        return (
          <View>
            <Titlebar title={'Messages'} provideBack={false} messageComposer />
            <MessagesList>
              <ThreadsList
                active={activeThread}
                threads={threads}
                currentUser={currentUser}
              />
            </MessagesList>
          </View>
        );
      }
    } else {
      // if there is a user, but they've never had a dmThread, send them to /messages/new
      if (
        data.user && data.user.directMessageThreadsConnection.edges.length === 0
      ) {
        return (
          <View>
            <MessagesList>
              <Link to="/messages/new">
                <ComposeHeader>
                  <Icon glyph="message-new" />
                </ComposeHeader>
              </Link>
            </MessagesList>

            <NewThread threads={threads} currentUser={currentUser} />
          </View>
        );
      } else {
        //otherwise, let the route handle which detailView to see
        if (match.params.threadId) {
          {
            /*
            pass the user's existing DM threads into the composer so that we can more quickly
            determine if the user is creating a new thread or has typed the names that map
            to an existing DM thread
           */
          }
          return (
            <View>
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
              <ExistingThread
                match={match}
                threads={threads}
                currentUser={currentUser}
                setActiveThread={this.setActiveThread}
              />
            </View>
          );
        } else {
          {
            /*
            if a thread is being viewed and the threadId !== 'new', pass the
            threads down the tree to fetch the messages for the urls threadId
           */
          }
          return (
            <View>
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
              <NewThread
                match={match}
                threads={threads}
                currentUser={currentUser}
              />
            </View>
          );
        }
      }
    }
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
