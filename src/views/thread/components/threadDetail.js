// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { timeDifference } from 'shared/time-difference';
import { convertTimestampToDate } from 'shared/time-formatting';
import { openModal } from 'src/actions/modals';
import { addToastWithTimeout } from 'src/actions/toasts';
import setThreadLockMutation from 'shared/graphql/mutations/thread/lockThread';
import ThreadByline from './threadByline';
import deleteThreadMutation from 'shared/graphql/mutations/thread/deleteThread';
import editThreadMutation from 'shared/graphql/mutations/thread/editThread';
import pinThreadMutation from 'shared/graphql/mutations/community/pinCommunityThread';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import Editor from 'src/components/rich-text-editor';
import { toJSON, toState } from 'shared/draft-utils';
import Textarea from 'react-textarea-autosize';
import ActionBar from './actionBar';
import ConditionalWrap from 'src/components/conditionalWrap';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  UserHoverProfile,
  CommunityHoverProfile,
  ChannelHoverProfile,
} from 'src/components/hoverProfile';
import {
  ThreadTitle,
  ThreadWrapper,
  ThreadContent,
  ThreadHeading,
  ThreadSubtitle,
} from '../style';
import { track, events, transformations } from 'src/helpers/analytics';
import getThreadLink from 'src/helpers/get-thread-link';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

type State = {
  isEditing?: boolean,
  body?: any,
  title?: string,
  receiveNotifications?: boolean,
  isSavingEdit?: boolean,
  flyoutOpen?: ?boolean,
  error?: ?string,
  isLockingThread: boolean,
  isPinningThread: boolean,
};

type Props = {
  thread: GetThreadType,
  setThreadLock: Function,
  pinThread: Function,
  editThread: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  toggleEdit: Function,
  innerRef?: any,
};

class ThreadDetailPure extends React.Component<Props, State> {
  state = {
    isLockingThread: false,
    isPinningThread: false,
    isEditing: false,
    body: null,
    title: '',
    receiveNotifications: false,
    isSavingEdit: false,
    flyoutOpen: false,
    error: '',
  };

  bodyEditor: any;
  titleTextarea: React.Node;

  componentWillMount() {
    this.setThreadState();
  }

  setThreadState() {
    const { thread } = this.props;

    track(events.THREAD_VIEWED, {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(thread.channel),
      community: transformations.analyticsCommunity(thread.community),
    });

    return this.setState({
      isEditing: false,
      body: toState(JSON.parse(thread.content.body)),
      title: thread.content.title,
      flyoutOpen: false,
      receiveNotifications: thread.receiveNotifications,
      isSavingEdit: false,
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

  threadLock = () => {
    const { setThreadLock, dispatch, thread } = this.props;
    const value = !thread.isLocked;
    const threadId = thread.id;

    this.setState({
      isLockingThread: true,
    });

    setThreadLock({
      threadId,
      value,
    })
      .then(({ data: { setThreadLock } }) => {
        this.setState({
          isLockingThread: false,
        });
        if (setThreadLock.isLocked) {
          return dispatch(addToastWithTimeout('neutral', 'Thread locked.'));
        } else {
          return dispatch(addToastWithTimeout('success', 'Thread unlocked!'));
        }
      })
      .catch(err => {
        this.setState({
          isLockingThread: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  triggerDelete = e => {
    e.preventDefault();
    const { thread, dispatch } = this.props;

    const threadId = thread.id;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner = thread.community.communityPermissions.isOwner;

    let message;

    if (isCommunityOwner && !thread.isAuthor) {
      message = `You are about to delete another person's thread. As the owner of the ${
        thread.community.name
      } community, you have permission to do this. The thread author will be notified that this thread was deleted.`;
    } else if (isChannelOwner && !thread.isAuthor) {
      message = `You are about to delete another person's thread. As the owner of the ${
        thread.channel.name
      } channel, you have permission to do this. The thread author will be notified that this thread was deleted.`;
    } else {
      message = 'Are you sure you want to delete this thread?';
    }

    track(events.THREAD_DELETED_INITED, {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(thread.channel),
      community: transformations.analyticsCommunity(thread.community),
    });

    return dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: threadId,
        entity: 'thread',
        message,
        extraProps: {
          thread,
        },
      })
    );
  };

  toggleEdit = () => {
    const { isEditing } = this.state;
    const { thread } = this.props;

    this.setState({
      isEditing: !isEditing,
    });

    if (!isEditing) {
      track(events.THREAD_EDITED_INITED, {
        thread: transformations.analyticsThread(thread),
        channel: transformations.analyticsChannel(thread.channel),
        community: transformations.analyticsCommunity(thread.community),
      });
    }

    this.props.toggleEdit();
  };

  saveEdit = () => {
    const { dispatch, editThread, thread } = this.props;
    const { title, body } = this.state;
    const threadId = thread.id;

    if (!title || title.trim().length === 0) {
      dispatch(
        addToastWithTimeout('error', 'Be sure to save a title for your thread!')
      );
      return;
    }

    this.setState({
      isSavingEdit: true,
    });

    const jsonBody = toJSON(body);

    const content = {
      title: title.trim(),
      body: JSON.stringify(jsonBody),
    };

    // Get the images
    const filesToUpload = Object.keys(jsonBody.entityMap)
      .filter(
        key =>
          jsonBody.entityMap[key].type.toLowerCase() === 'image' &&
          jsonBody.entityMap[key].data.file &&
          jsonBody.entityMap[key].data.file.constructor === File
      )
      .map(key => jsonBody.entityMap[key].data.file);

    const input = {
      threadId,
      content,
      filesToUpload,
    };

    editThread(input)
      .then(({ data: { editThread } }) => {
        this.setState({
          isSavingEdit: false,
        });

        if (editThread && editThread !== null) {
          this.toggleEdit();
          return dispatch(addToastWithTimeout('success', 'Thread saved!'));
        } else {
          return dispatch(
            addToastWithTimeout(
              'error',
              "We weren't able to save these changes. Try again?"
            )
          );
        }
      })
      .catch(err => {
        this.setState({
          isSavingEdit: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

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

  changeBody = state => {
    this.setState({
      body: state,
    });
  };

  togglePinThread = () => {
    const { pinThread, thread, dispatch } = this.props;
    const isPinned = thread.community.pinnedThreadId === thread.id;
    const communityId = thread.community.id;

    if (thread.channel.isPrivate) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Only threads in public channels can be pinned.'
        )
      );
    }

    this.setState({
      isPinningThread: true,
    });

    return pinThread({
      threadId: thread.id,
      communityId,
      value: isPinned ? null : thread.id,
    })
      .then(() => {
        this.setState({
          isPinningThread: false,
        });
      })
      .catch(err => {
        this.setState({
          isPinningThread: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { currentUser, thread } = this.props;

    const {
      isEditing,
      body,
      isSavingEdit,
      isLockingThread,
      isPinningThread,
    } = this.state;

    // if there is no body it means the user is switching threads or the thread
    // hasnt loaded yet - we need this body for the editor, otherwise the
    // thread view will crash. If no body exists we return null to wait for
    // the body to be set in state after the thread loads.
    if (!body) return null;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);

    const editedTimestamp = thread.modifiedAt
      ? new Date(thread.modifiedAt).getTime()
      : null;

    return (
      <ThreadWrapper innerRef={this.props.innerRef}>
        <ThreadContent isEditing={isEditing}>
          {/* $FlowFixMe */}
          <ErrorBoundary fallbackComponent={null}>
            <ConditionalWrap
              condition={!!thread.author.user.username}
              wrap={() => (
                <UserHoverProfile username={thread.author.user.username}>
                  <ThreadByline author={thread.author} />
                </UserHoverProfile>
              )}
            >
              <ThreadByline author={thread.author} />
            </ConditionalWrap>
          </ErrorBoundary>

          {isEditing ? (
            <Textarea
              onChange={this.changeTitle}
              style={ThreadTitle}
              value={this.state.title}
              placeholder={'A title for your thread...'}
              ref={c => {
                this.titleTextarea = c;
              }}
              autoFocus
              data-cy="thread-editor-title-input"
            />
          ) : (
            <ThreadHeading>{thread.content.title}</ThreadHeading>
          )}

          <ThreadSubtitle>
            <CommunityHoverProfile id={thread.community.id}>
              <Link to={`/${thread.community.slug}`}>
                {thread.community.name}
              </Link>
            </CommunityHoverProfile>
            <span>&nbsp;/&nbsp;</span>
            <ChannelHoverProfile id={thread.channel.id}>
              <Link to={`/${thread.community.slug}/${thread.channel.slug}`}>
                {thread.channel.name}
              </Link>
            </ChannelHoverProfile>
            <span>&nbsp;·&nbsp;</span>
            <Link to={'/' + getThreadLink(thread)}>
              {timestamp}
              {thread.modifiedAt && (
                <React.Fragment>
                  {' '}
                  (Edited{' '}
                  {timeDifference(Date.now(), editedTimestamp).toLowerCase()})
                </React.Fragment>
              )}
            </Link>
          </ThreadSubtitle>

          {/* $FlowFixMe */}
          <Editor
            readOnly={!this.state.isEditing}
            state={body}
            onChange={this.changeBody}
            editorKey="thread-detail"
            placeholder="Write more thoughts here..."
            editorRef={editor => (this.bodyEditor = editor)}
            version={2}
          />
        </ThreadContent>

        <ErrorBoundary fallbackComponent={null}>
          <ActionBar
            toggleEdit={this.toggleEdit}
            currentUser={currentUser}
            thread={thread}
            saveEdit={this.saveEdit}
            togglePinThread={this.togglePinThread}
            isSavingEdit={isSavingEdit}
            threadLock={this.threadLock}
            triggerDelete={this.triggerDelete}
            isEditing={isEditing}
            title={this.state.title}
            isLockingThread={isLockingThread}
            isPinningThread={isPinningThread}
          />
        </ErrorBoundary>
      </ThreadWrapper>
    );
  }
}

const ThreadDetail = compose(
  setThreadLockMutation,
  deleteThreadMutation,
  editThreadMutation,
  pinThreadMutation,
  withRouter
)(ThreadDetailPure);

const map = state => ({
  flyoutOpen: state.flyoutOpen,
});

export default compose(
  withCurrentUser,
  // $FlowIssue
  connect(map)
)(ThreadDetail);
