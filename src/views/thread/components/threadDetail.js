// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getLinkPreviewFromUrl } from '../../../helpers/utils';
import { timeDifference } from 'shared/time-difference';
import { convertTimestampToDate } from 'shared/time-formatting';
import isURL from 'validator/lib/isURL';
import { URLS } from '../../../helpers/regexps';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import setThreadLockMutation from 'shared/graphql/mutations/thread/lockThread';
import ThreadByline from './threadByline';
import deleteThreadMutation from 'shared/graphql/mutations/thread/deleteThread';
import editThreadMutation from 'shared/graphql/mutations/thread/editThread';
import pinThreadMutation from 'shared/graphql/mutations/community/pinCommunityThread';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import Editor from '../../../components/rich-text-editor';
import { toJSON, toPlainText, toState } from 'shared/draft-utils';
import Textarea from 'react-textarea-autosize';
import ActionBar from './actionBar';
import {
  ThreadTitle,
  ThreadWrapper,
  ThreadContent,
  ThreadHeading,
  Edited,
  ThreadSubtitle,
} from '../style';
import { track, events, transformations } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

const ENDS_IN_WHITESPACE = /(\s|\n)$/;

type State = {
  isEditing?: boolean,
  body?: any,
  title?: string,
  linkPreview?: ?Object,
  linkPreviewTrueUrl?: string,
  linkPreviewLength?: number,
  fetchingLinkPreview?: boolean,
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
};

const getThreadStateFromProps = thread => {
  track(events.THREAD_VIEWED, {
    thread: transformations.analyticsThread(thread),
    channel: transformations.analyticsChannel(thread.channel),
    community: transformations.analyticsCommunity(thread.community),
  });

  let rawLinkPreview =
    thread.attachments && thread.attachments.length > 0
      ? thread.attachments.filter(
          attachment =>
            attachment && attachment.attachmentType === 'linkPreview'
        )[0]
      : null;

  let cleanLinkPreview = rawLinkPreview && {
    attachmentType: rawLinkPreview.attachmentType,
    data: JSON.parse(rawLinkPreview.data),
  };

  return {
    isEditing: false,
    body: toState(JSON.parse(thread.content.body)),
    title: thread.content.title,
    // $FlowFixMe
    linkPreview: rawLinkPreview ? cleanLinkPreview.data : null,
    linkPreviewTrueUrl:
      thread.attachments &&
      thread.attachments.length > 0 &&
      thread.attachments[0]
        ? thread.attachments[0].trueUrl
        : '',
    linkPreviewLength:
      thread.attachments && thread.attachments.length > 0 ? 1 : 0,
    fetchingLinkPreview: false,
    flyoutOpen: false,
    receiveNotifications: thread.receiveNotifications,
    isSavingEdit: false,
  };
};

class ThreadDetailPure extends React.Component<Props, State> {
  state = {
    isLockingThread: false,
    isPinningThread: false,
    isEditing: false,
    body: null,
    title: '',
    linkPreview: null,
    linkPreviewTrueUrl: '',
    fetchingLinkPreview: false,
    receiveNotifications: false,
    isSavingEdit: false,
    flyoutOpen: false,
    error: '',
    linkPreviewLength: 0,
  };

  // $FlowFixMe
  bodyEditor: any;
  titleTextarea: React.Node;

  static getDerivedStateFromProps(props) {
    return getThreadStateFromProps(props.thread);
  }

  setThreadState() {
    const newState = getThreadStateFromProps(this.props.thread);
    return this.setState({
      ...newState,
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
    } else if (thread.isAuthor) {
      message = 'Are you sure you want to delete this thread?';
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
    const { linkPreview, linkPreviewTrueUrl, title, body } = this.state;
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

    const attachments = [];
    if (linkPreview) {
      const attachmentData = JSON.stringify({
        ...linkPreview,
        trueUrl: linkPreviewTrueUrl,
      });
      attachments.push({
        attachmentType: 'linkPreview',
        data: attachmentData,
      });
    }

    // Get the images
    const filesToUpload = Object.keys(jsonBody.entityMap)
      .filter(
        key =>
          jsonBody.entityMap[key].type === 'image' &&
          jsonBody.entityMap[key].data.file &&
          jsonBody.entityMap[key].data.file.constructor === File
      )
      .map(key => jsonBody.entityMap[key].data.file);

    const input = {
      threadId,
      content,
      attachments,
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
    this.listenForUrl(state);
    this.setState({
      body: state,
    });
  };

  listenForUrl = state => {
    const { linkPreview, linkPreviewLength } = this.state;
    if (linkPreview !== null) return;

    const lastChangeType = state.getLastChangeType();
    if (
      lastChangeType !== 'backspace-character' &&
      lastChangeType !== 'insert-characters'
    ) {
      return;
    }

    const text = toPlainText(state);

    if (!ENDS_IN_WHITESPACE.test(text)) return;

    const toCheck = text.match(URLS);

    if (toCheck) {
      const len = toCheck.length;
      if (linkPreviewLength === len) return; // no new links, don't recheck

      let urlToCheck = toCheck[len - 1].trim();

      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      if (!isURL(urlToCheck)) return;
      this.setState({ fetchingLinkPreview: true });

      getLinkPreviewFromUrl(urlToCheck)
        .then(data => {
          return this.setState(prevState => ({
            linkPreview: { ...data, trueUrl: urlToCheck },
            linkPreviewTrueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
            error: null,
          }));
        })
        .catch(() => {
          this.setState({
            error:
              "Oops, that URL didn't seem to want to work. You can still publish your story anyways 👍",
            fetchingLinkPreview: false,
          });
        });
    }
  };

  removeLinkPreview = () => {
    this.setState({
      linkPreview: null,
      linkPreviewTrueUrl: '',
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
      linkPreview,
      body,
      fetchingLinkPreview,
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
      <ThreadWrapper>
        <ThreadContent isEditing={isEditing}>
          {/* $FlowFixMe */}
          <ErrorBoundary fallbackComponent={null}>
            <ThreadByline author={thread.author} />
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
            <Link to={`/${thread.community.slug}`}>
              {thread.community.name}
            </Link>
            {thread.channel.slug !== 'general' && <span>/</span>}
            {thread.channel.slug !== 'general' && (
              <Link to={`/${thread.community.slug}/${thread.channel.slug}`}>
                {thread.channel.name}
              </Link>
            )}
            <Link to={`/thread/${thread.id}`}>{` · ${timestamp}`}</Link>
          </ThreadSubtitle>

          {thread.modifiedAt && (
            <Edited>
              {'· '}(Edited{' '}
              {timeDifference(Date.now(), editedTimestamp).toLowerCase()})
            </Edited>
          )}

          {/* $FlowFixMe */}
          <Editor
            readOnly={!this.state.isEditing}
            state={body}
            onChange={this.changeBody}
            editorKey="thread-detail"
            placeholder="Write more thoughts here..."
            showLinkPreview={true}
            editorRef={editor => (this.bodyEditor = editor)}
            version={2}
            linkPreview={{
              loading: fetchingLinkPreview,
              remove: this.removeLinkPreview,
              trueUrl: linkPreview && linkPreview.url,
              data: linkPreview,
            }}
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
  currentUser: state.users.currentUser,
  flyoutOpen: state.flyoutOpen,
});

// $FlowIssue
export default connect(map)(ThreadDetail);
