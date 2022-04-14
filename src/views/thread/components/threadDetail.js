// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { timeDifference } from 'shared/time-difference';
import { convertTimestampToDate } from 'shared/time-formatting';
import { addToastWithTimeout } from 'src/actions/toasts';
import editThreadMutation from 'shared/graphql/mutations/thread/editThread';
import uploadImageMutation from 'shared/graphql/mutations/uploadImage';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import ThreadRenderer from 'src/components/threadRenderer';
import ActionBar from './actionBar';
import ThreadEditInputs from 'src/components/composer/inputs';
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
};

type Props = {
  thread: GetThreadType,
  setThreadLock: Function,
  editThread: Function,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  toggleEdit: Function,
  uploadImage: Function,
  ref?: any,
};

class ThreadDetailPure extends React.Component<Props, State> {
  state = {
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

  render() {
    const { currentUser, thread } = this.props;

    const { isEditing, isSavingEdit } = this.state;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);
    const { author } = thread;

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
              <BylineContainer>
                <UserListItem
                  userObject={author.user}
                  name={author.user.name}
                  username={author.user.username}
                  profilePhoto={author.user.profilePhoto}
                  badges={author.roles}
                  isCurrentUser={
                    currentUser && author.user.id === currentUser.id
                  }
                  isOnline={author.user.isOnline}
                  avatarSize={40}
                  showHoverProfile={false}
                  messageButton={
                    currentUser && author.user.id !== currentUser.id
                  }
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
                  The {thread.community.name} community has a new home. This
                  thread is preserved for historical purposes. The content of
                  this conversation may be innaccurrate or out of date.{' '}
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
                      {timeDifference(
                        Date.now(),
                        editedTimestamp
                      ).toLowerCase()}
                      {thread.editedBy &&
                        thread.editedBy.user.id !== thread.author.user.id &&
                        ` by @${thread.editedBy.user.username}`}
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
            isSavingEdit={isSavingEdit}
            isEditing={isEditing}
            title={this.state.title}
            uploadFiles={this.uploadFiles}
          />
        </ErrorBoundary>
      </ThreadWrapper>
    );
  }
}

const ThreadDetail = compose(
  editThreadMutation,
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
