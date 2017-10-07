import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  getLinkPreviewFromUrl,
  timeDifference,
  convertTimestampToDate,
  truncateNumber,
} from '../../../helpers/utils';
import { URLS } from '../../../helpers/regexps';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  setThreadLockMutation,
  toggleThreadNotificationsMutation,
} from '../mutations';
import { deleteThreadMutation, editThreadMutation } from '../../../api/thread';
import { pinThreadMutation } from '../../../api/community';
import { FlexRow } from '../../../components/globals';
import Icon from '../../../components/icons';
import Flyout from '../../../components/flyout';
import Badge from '../../../components/badges';
import { IconButton, Button } from '../../../components/buttons';
import { track } from '../../../helpers/events';
import Editor from '../../../components/draftjs-editor';
import { toJSON, toPlainText, toState } from 'shared/draft-utils';
import Reputation from '../../../components/reputation';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
import {
  ThreadTitle,
  ThreadWrapper,
  ThreadHeading,
  Byline,
  ContextRow,
  DropWrap,
  FlyoutRow,
  EditDone,
  Timestamp,
  Edited,
  BylineMeta,
  AuthorAvatar,
  AuthorName,
  AuthorUsername,
  Location,
} from '../style';

const ENDS_IN_WHITESPACE = /(\s|\n)$/;

class ThreadDetailPure extends Component {
  state: {
    isEditing: boolean,
    body: any,
    title: string,
    linkPreview: Object,
    linkPreviewTrueUrl: string,
    linkPreviewLength: number,
    fetchingLinkPreview: boolean,
    receiveNotifications: boolean,
    isSavingEdit: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  setThreadState() {
    const { thread } = this.props;

    let rawLinkPreview =
      thread.attachments && thread.attachments.length > 0
        ? thread.attachments.filter(
            attachment => attachment.attachmentType === 'linkPreview'
          )[0]
        : null;

    let cleanLinkPreview = rawLinkPreview && {
      attachmentType: rawLinkPreview.attachmentType,
      data: JSON.parse(rawLinkPreview.data),
    };

    this.setState({
      isEditing: false,
      body: toState(JSON.parse(thread.content.body)),
      title: thread.content.title,
      linkPreview: rawLinkPreview ? cleanLinkPreview.data : null,
      linkPreviewTrueUrl:
        thread.attachments.length > 0 ? thread.attachments[0].trueUrl : '',
      linkPreviewLength: thread.attachments.length > 0 ? 1 : 0,
      fetchingLinkPreview: false,
      flyoutOpen: false,
      receiveNotifications: thread.receiveNotifications,
      isSavingEdit: false,
    });
  }

  componentWillMount() {
    this.setThreadState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.thread.id !== this.props.thread.id) {
      this.setThreadState();
    }
  }

  toggleFlyout = () => {
    if (this.state.flyoutOpen === false) {
      this.setState({ flyoutOpen: true });
    } else {
      this.setState({ flyoutOpen: false });
    }
  };

  threadLock = () => {
    const { setThreadLock, dispatch, thread } = this.props;
    const value = !thread.isLocked;
    const threadId = thread.id;

    setThreadLock({
      threadId,
      value,
    })
      .then(({ data: { setThreadLock } }) => {
        if (setThreadLock.isLocked) {
          track('thread', 'locked', null);
          dispatch(addToastWithTimeout('neutral', 'Thread locked.'));
        } else {
          track('thread', 'unlocked', null);
          dispatch(addToastWithTimeout('success', 'Thread unlocked!'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  triggerDelete = e => {
    e.preventDefault();
    const { thread, dispatch } = this.props;

    track('thread', 'delete inited', null);

    const threadId = thread.id;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner =
      thread.channel.community.communityPermissions.isOwner;

    let message;

    if (isCommunityOwner && !thread.isCreator) {
      message = `You are about to delete another person's thread. As the owner of the ${thread
        .channel.community
        .name} community, you have permission to do this. The thread creator will be notified that this thread was deleted.`;
    } else if (isChannelOwner && !thread.isCreator) {
      message = `You are about to delete another person's thread. As the owner of the ${thread.channel} channel, you have permission to do this. The thread creator will be notified that this thread was deleted.`;
    } else if (thread.isCreator) {
      message = 'Are you sure you want to delete this thread?';
    } else {
      message = 'Are you sure you want to delete this thread?';
    }

    return dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: threadId,
        entity: 'thread',
        message,
      })
    );
  };

  toggleNotification = () => {
    const { receiveNotifications } = this.state;
    const { thread, dispatch, toggleThreadNotifications } = this.props;
    const threadId = thread.id;

    this.setState({
      receiveNotifications: !receiveNotifications,
    });

    toggleThreadNotifications({
      threadId,
    })
      .then(({ data: { toggleThreadNotifications } }) => {
        if (toggleThreadNotifications.receiveNotifications) {
          track('thread', 'notifications turned on', null);
          dispatch(addToastWithTimeout('success', 'Notifications activated!'));
        } else {
          track('thread', 'notifications turned off', null);
          dispatch(addToastWithTimeout('neutral', 'Notifications turned off'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  toggleEdit = () => {
    const { isEditing } = this.state;
    this.setState({
      isEditing: !isEditing,
    });
  };

  saveEdit = () => {
    const { dispatch, editThread, thread } = this.props;
    const { linkPreview, linkPreviewTrueUrl, title, body } = this.state;
    const threadId = thread.id;

    if (!title || title.length === 0) {
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
      title,
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
      .filter(key => jsonBody.entityMap[key].type === 'image')
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
          dispatch(addToastWithTimeout('success', 'Thread saved!'));
        } else {
          dispatch(
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
      this.bodyEditor.focus();
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

      this.setState({ fetchingLinkPreview: true });

      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      getLinkPreviewFromUrl(urlToCheck)
        .then(data => {
          // this.props.dispatch(stopLoading());

          this.setState(prevState => ({
            linkPreview: data,
            linkPreviewTrueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
            error: null,
          }));

          const linkPreview = {};
          linkPreview['data'] = data;
          linkPreview['trueUrl'] = urlToCheck;

          // this.props.dispatch(addLinkPreview(linkPreview));
        })
        .catch(err => {
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
    const isPinned = thread.channel.community.pinnedThreadId === thread.id;
    const communityId = thread.channel.community.id;

    if (thread.channel.isPrivate) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Only threads in public channels can be pinned.'
        )
      );
    }

    return pinThread({
      threadId: thread.id,
      communityId,
      value: isPinned ? null : thread.id,
    }).catch(err => dispatch(addToastWithTimeout('error', err.message)));
  };

  render() {
    const { currentUser, thread } = this.props;

    const {
      isEditing,
      linkPreview,
      body,
      fetchingLinkPreview,
      flyoutOpen,
      isSavingEdit,
    } = this.state;

    const isChannelMember = thread.channel.channelPermissions.isMember;
    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner =
      thread.channel.community.communityPermissions.isOwner;
    const isPinned = thread.channel.community.pinnedThreadId === thread.id;

    const isEdited = thread.modifiedAt;
    const editedTimestamp = isEdited
      ? new Date(thread.modifiedAt).getTime()
      : null;

    return (
      <ThreadWrapper>
        {!isEditing && (
          <Location>
            {this.props.slider ? (
              <div style={{ width: '16px' }} />
            ) : (
              <Icon glyph="view-back" size={16} />
            )}
            <Link to={`/${thread.channel.community.slug}`}>
              {thread.channel.community.name}
            </Link>
            <span>/</span>
            <Link
              to={`/${thread.channel.community.slug}/${thread.channel.slug}`}
            >
              {thread.channel.name}
            </Link>
          </Location>
        )}

        <ContextRow>
          <Byline>
            <AuthorAvatar
              size={48}
              radius={48}
              onlineSize={'large'}
              isOnline={thread.creator.isOnline}
              src={thread.creator.profilePhoto}
              link={
                thread.creator.username
                  ? `/users/${thread.creator.username}`
                  : null
              }
            />
            <BylineMeta>
              <Link to={`/users/${thread.creator.username}`}>
                <AuthorName>{thread.creator.name}</AuthorName>
              </Link>
              <AuthorUsername>
                {thread.creator.username && `@${thread.creator.username}`}
                {thread.creator.isAdmin && <Badge type="admin" />}
                {thread.creator.isPro && <Badge type="pro" />}
              </AuthorUsername>
              <AuthorUsername>
                {thread.creator &&
                  thread.creator.contextPermissions &&
                  thread.creator.contextPermissions.reputation > 0 && (
                    <span>
                      <Reputation tipText={'Author rep in this community'} />
                      {truncateNumber(
                        thread.creator.contextPermissions.reputation,
                        1
                      )}{' '}
                      rep
                    </span>
                  )}
              </AuthorUsername>
            </BylineMeta>
          </Byline>
          {currentUser &&
            !isEditing &&
            isChannelMember &&
            (isChannelOwner || isCommunityOwner || thread.isCreator) && (
              <DropWrap className={flyoutOpen ? 'open' : ''}>
                <IconButton glyph="settings" onClick={this.toggleFlyout} />
                <Flyout>
                  {isCommunityOwner &&
                    !thread.channel.isPrivate && (
                      <FlyoutRow>
                        <IconButton
                          glyph={isPinned ? 'pin-fill' : 'pin'}
                          hoverColor={
                            isPinned ? 'warn.default' : 'special.default'
                          }
                          tipText={
                            isPinned
                              ? 'Un-pin thread'
                              : `Pin in ${thread.channel.community.name}`
                          }
                          tipLocation="top-left"
                          onClick={this.togglePinThread}
                        />
                      </FlyoutRow>
                    )}
                  {(isChannelOwner || isCommunityOwner) && (
                      <FlyoutRow>
                        <IconButton
                          glyph="freeze"
                          hoverColor="space.alt"
                          tipText={
                            thread.isLocked ? 'Unfreeze chat' : 'Freeze chat'
                          }
                          tipLocation="top-left"
                          onClick={this.threadLock}
                        />
                      </FlyoutRow>
                    )}
                  {(thread.isCreator || isChannelOwner || isCommunityOwner) && (
                      <FlyoutRow>
                        <IconButton
                          glyph="delete"
                          hoverColor="warn.alt"
                          tipText="Delete thread"
                          tipLocation="top-left"
                          onClick={this.triggerDelete}
                        />
                      </FlyoutRow>
                    )}
                  {thread.isCreator && (
                    <FlyoutRow>
                      <IconButton
                        glyph="edit"
                        hoverColor="text.alt"
                        tipText="Edit"
                        tipLocation="top-left"
                        onClick={this.toggleEdit}
                      />
                    </FlyoutRow>
                  )}
                </Flyout>
              </DropWrap>
            )}

          {isChannelMember &&
            !isEditing &&
            currentUser && (
              <DropWrap>
                <IconButton
                  glyph={
                    thread.receiveNotifications
                      ? 'notification-fill'
                      : 'notification'
                  }
                  hoverColor="text.alt"
                  tipText={
                    thread.receiveNotifications
                      ? 'Turn off notifications'
                      : 'Get notifications'
                  }
                  tipLocation="top-left"
                  onClick={this.toggleNotification}
                />
              </DropWrap>
            )}

          {isEditing && (
            <EditDone>
              <Button loading={isSavingEdit} onClick={this.saveEdit}>
                Save
              </Button>
            </EditDone>
          )}
        </ContextRow>

        <span>
          {isEditing ? (
            <Textarea
              onChange={this.changeTitle}
              style={ThreadTitle}
              value={this.state.title}
              placeholder={'A title for your thread...'}
              ref="titleTextarea"
              autoFocus
            />
          ) : (
            <ThreadHeading>{thread.content.title}</ThreadHeading>
          )}
          <FlexRow>
            <Timestamp>{convertTimestampToDate(thread.createdAt)}</Timestamp>
            {thread.modifiedAt && (
              <Edited>
                (Edited {timeDifference(Date.now(), editedTimestamp)})
              </Edited>
            )}
          </FlexRow>
          <Editor
            readOnly={!this.state.isEditing}
            state={body}
            onChange={this.changeBody}
            editorKey="thread-detail"
            placeholder="Write more thoughts here..."
            showLinkPreview={true}
            linkPreview={{
              loading: fetchingLinkPreview,
              remove: this.removeLinkPreview,
              trueUrl: linkPreview && linkPreview.url,
              data: linkPreview,
            }}
          />
        </span>
      </ThreadWrapper>
    );
  }
}

const ThreadDetail = compose(
  setThreadLockMutation,
  deleteThreadMutation,
  editThreadMutation,
  pinThreadMutation,
  toggleThreadNotificationsMutation,
  withRouter
)(ThreadDetailPure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  flyoutOpen: state.flyoutOpen,
});
export default connect(mapStateToProps)(ThreadDetail);
