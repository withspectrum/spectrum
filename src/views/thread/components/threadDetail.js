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
import uploadImageMutation from 'shared/graphql/mutations/uploadImage';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import ThreadRenderer from 'src/components/threadRenderer';
import ActionBar from './actionBar';
import ConditionalWrap from 'src/components/conditionalWrap';
import ThreadEditInputs from 'src/components/composer/inputs';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { UserHoverProfile } from 'src/components/hoverProfile';
import {
  ThreadWrapper,
  ThreadContent,
  ThreadHeading,
  ThreadSubtitle,
} from '../style';
import { track, events, transformations } from 'src/helpers/analytics';
import getThreadLink from 'src/helpers/get-thread-link';
import { ENTER } from 'src/helpers/keycodes';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

type State = {
  isEditing?: boolean,
  body: ?string,
  title: string,
  receiveNotifications?: boolean,
  isSavingEdit?: boolean,
  flyoutOpen?: ?boolean,
  error?: ?string,
  parsedBody: ?Object,
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
  uploadImage: Function,
  ref?: any,
};

class ThreadDetailPure extends React.Component<Props, State> {
  state = {
    isLockingThread: false,
    isPinningThread: false,
    isEditing: false,
    parsedBody: null,
    body: '',
    title: '',
    receiveNotifications: false,
    isSavingEdit: false,
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

    track(events.THREAD_VIEWED, {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(thread.channel),
      community: transformations.analyticsCommunity(thread.community),
    });

    const parsedBody = JSON.parse(thread.content.body);

    return this.setState({
      isEditing: false,
      body: '',
      title: thread.content.title,
      // We store this in the state to avoid having to JSON.parse on every render
      parsedBody,
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
      title: thread.content.title,
      body: null,
    });

    fetch('https://convert.spectrum.chat/to', {
      method: 'POST',
      body: thread.content.body,
    })
      .then(res => {
        if (res.status >= 300 || res.status < 200)
          throw new Error('Oops, something went wrong.');
        return res;
      })
      .then(res => res.text())
      .then(md => {
        this.setState({
          body: md,
        });
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        this.setState({
          isEditing,
          body: '',
        });
        this.props.toggleEdit && this.props.toggleEdit();
      });

    this.props.toggleEdit && this.props.toggleEdit();

    if (!isEditing) {
      track(events.THREAD_EDITED_INITED, {
        thread: transformations.analyticsThread(thread),
        channel: transformations.analyticsChannel(thread.channel),
        community: transformations.analyticsCommunity(thread.community),
      });
    }
  };

  handleKeyPress = e => {
    const cmdEnter = e.keyCode === ENTER && e.metaKey;
    if (cmdEnter) return this.saveEdit();
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

    const content = {
      title: title.trim(),
      body,
    };

    const input = {
      threadId,
      content,
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

  changeBody = evt => {
    this.setState({
      body: evt.target.value,
    });
  };

  uploadFiles = files => {
    const uploading = `![Uploading ${files[0].name}...]()`;
    let caretPos = this.bodyEditor.selectionStart;
    const { body } = this.state;
    if (!body) return;

    this.setState(
      {
        isSavingEdit: true,
        body:
          body.substring(0, caretPos) +
          uploading +
          body.substring(this.bodyEditor.selectionEnd, body.length),
      },
      () => {
        caretPos = caretPos + uploading.length;
        this.bodyEditor.selectionStart = caretPos;
        this.bodyEditor.selectionEnd = caretPos;
        this.bodyEditor.focus();
      }
    );

    return this.props
      .uploadImage({
        image: files[0],
        type: 'threads',
      })
      .then(({ data }) => {
        this.setState({
          isSavingEdit: false,
        });
        if (!this.state.body) return;
        this.changeBody({
          target: {
            value: this.state.body.replace(
              uploading,
              `![${files[0].name}](${data.uploadImage})`
            ),
          },
        });
      })
      .catch(err => {
        console.error({ err });
        this.setState({
          isSavingEdit: false,
        });
        if (!this.state.body) return;
        this.changeBody({
          target: {
            value: this.state.body.replace(uploading, ''),
          },
        });
        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `Uploading image failed - ${err.message}`
          )
        );
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
      isSavingEdit,
      isLockingThread,
      isPinningThread,
    } = this.state;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);

    const editedTimestamp = thread.modifiedAt
      ? new Date(thread.modifiedAt).getTime()
      : null;

    return (
      <ThreadWrapper isEditing={isEditing} ref={this.props.ref}>
        <ThreadContent isEditing={isEditing}>
          {isEditing ? (
            <ThreadEditInputs
              uploadFiles={this.uploadFiles}
              title={this.state.title}
              body={this.state.body}
              autoFocus
              bodyRef={ref => (this.bodyEditor = ref)}
              changeBody={this.changeBody}
              changeTitle={this.changeTitle}
              onKeyDown={this.handleKeyPress}
              isEditing={isEditing}
            />
          ) : (
            <React.Fragment>
              <ErrorBoundary>
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

              <div style={{ height: '16px' }} />

              <ThreadHeading>{thread.content.title}</ThreadHeading>

              <ThreadSubtitle>
                <Link to={getThreadLink(thread)}>
                  {timestamp}
                  {thread.modifiedAt && (
                    <React.Fragment>
                      {' '}
                      (Edited{' '}
                      {timeDifference(
                        Date.now(),
                        editedTimestamp
                      ).toLowerCase()}
                      )
                    </React.Fragment>
                  )}
                </Link>
              </ThreadSubtitle>

              <ThreadRenderer body={JSON.parse(thread.content.body)} />
            </React.Fragment>
          )}
        </ThreadContent>

        <ErrorBoundary>
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
            uploadFiles={this.uploadFiles}
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
  uploadImageMutation,
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
