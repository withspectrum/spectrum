// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { timeDifference } from 'shared/time-difference';
import { convertTimestampToDate } from 'shared/time-formatting';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import ThreadRenderer from 'src/components/threadRenderer';
import ActionBar from './actionBar';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { UserListItem } from 'src/components/entities';
import {
  ThreadWrapper,
  ThreadContent,
  ThreadHeading,
  ThreadSubtitle,
  BylineContainer,
} from '../style';
import getThreadLink from 'src/helpers/get-thread-link';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

type State = {
  body: ?string,
  title: string,
  flyoutOpen?: ?boolean,
  error?: ?string,
  parsedBody: ?Object,
};

type Props = {
  thread: GetThreadType,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  ref?: any,
};

class ThreadDetailPure extends React.Component<Props, State> {
  state = {
    parsedBody: null,
    body: '',
    title: '',
    flyoutOpen: false,
    error: '',
  };

  bodyEditor: any;
  titleTextarea: React$Node;

  componentWillMount() {
    this.setThreadState();
  }

  setThreadState() {
    const { thread } = this.props;

    const parsedBody = JSON.parse(thread.content.body);

    return this.setState({
      body: '',
      title: thread.content.title,
      // We store this in the state to avoid having to JSON.parse on every render
      parsedBody,
      flyoutOpen: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.thread &&
      this.props.thread &&
      prevProps.thread.id !== this.props.thread.id
    ) {
      this.setThreadState();
    }
  }

  changeTitle = e => {
    const title = e.target.value;
    if (/\n$/g.test(title)) {
      this.bodyEditor.focus && this.bodyEditor.focus();
      return;
    }
    this.setState({
      title,
    });
  };

  changeBody = evt => {
    this.setState({
      body: evt.target.value,
    });
  };

  render() {
    const { currentUser, thread } = this.props;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);
    const { author } = thread;

    const editedTimestamp = thread.modifiedAt
      ? new Date(thread.modifiedAt).getTime()
      : null;

    return (
      <ThreadWrapper ref={this.props.ref}>
        <ThreadContent>
          <BylineContainer>
            <UserListItem
              userObject={author.user}
              name={author.user.name}
              username={author.user.username}
              profilePhoto={author.user.profilePhoto}
              badges={author.roles}
              isCurrentUser={currentUser && author.user.id === currentUser.id}
              avatarSize={40}
              showHoverProfile={false}
              messageButton={currentUser && author.user.id !== currentUser.id}
            />
          </BylineContainer>

          {thread.community.website && thread.community.redirect && (
            <div
              style={{
                width: 'calc(100% + 32px)',
                borderBottom: '1px solid #f6f7f8',
                padding: '12px 16px',
                background: '#FFE6BF',
                marginLeft: '-16px',
                marginRight: '-16px',
                color: '#7D4A00',
              }}
            >
              The {thread.community.name} community has a new home. This thread
              is preserved for historical purposes. The content of this
              conversation may be innaccurrate or out of date.{' '}
              <a
                style={{ color: '#D85537', fontWeight: '600' }}
                href={thread.community.website}
              >
                Go to new community home &rarr;
              </a>
            </div>
          )}

          <div style={{ height: '16px' }} />

          <ThreadHeading>{thread.content.title}</ThreadHeading>

          <ThreadSubtitle>
            <Link to={getThreadLink(thread)}>
              {timestamp}
              {thread.modifiedAt && (
                <React.Fragment>
                  {' '}
                  (Edited{' '}
                  {timeDifference(Date.now(), editedTimestamp).toLowerCase()}
                  {thread.editedBy &&
                    thread.editedBy.user.id !== thread.author.user.id &&
                    ` by @${thread.editedBy.user.username}`}
                  )
                </React.Fragment>
              )}
            </Link>
          </ThreadSubtitle>

          <ThreadRenderer body={JSON.parse(thread.content.body)} />
        </ThreadContent>

        <ErrorBoundary>
          <ActionBar
            currentUser={currentUser}
            thread={thread}
            title={this.state.title}
          />
        </ErrorBoundary>
      </ThreadWrapper>
    );
  }
}

const ThreadDetail = compose(withRouter)(ThreadDetailPure);

const map = state => ({
  flyoutOpen: state.flyoutOpen,
});

export default compose(
  withCurrentUser,
  // $FlowIssue
  connect(map)
)(ThreadDetail);
