// @flow
import * as React from 'react';
import { btoa } from 'b2a';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { withRouter, type Location, type History } from 'react-router';
import queryString from 'query-string';
import Clipboard from 'react-clipboard.js';
import { openGallery } from 'src/actions/gallery';
import Tooltip from 'src/components/tooltip';
import Reaction from 'src/components/reaction';
import { ReactionWrapper } from 'src/components//reaction/style';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import { Body } from './view';
import EditingBody from './editingBody';
import { openModal } from 'src/actions/modals';
import { replyToMessage } from 'src/actions/message';
import { CLIENT_URL } from 'src/api/constants';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { UserAvatar } from 'src/components/avatar';
import AuthorByline from './authorByline';
import Icon from 'src/components/icon';
import { addToastWithTimeout } from 'src/actions/toasts';
import toggleReactionMutation from 'shared/graphql/mutations/reaction/toggleReaction';
import {
  convertTimestampToTime,
  convertTimestampToDate,
} from 'shared/time-formatting';
import ConditionalWrap from 'src/components/conditionalWrap';
import {
  OuterMessageContainer,
  InnerMessageContainer,
  GutterContainer,
  GutterTimestamp,
  AuthorAvatarContainer,
  ActionsContainer,
  Actions,
  Action,
  LikeAction,
  EditedIndicator,
} from './style';
import getThreadLink from 'src/helpers/get-thread-link';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import deleteMessage from 'shared/graphql/mutations/message/deleteMessage';
import { deleteMessageWithToast } from 'src/components/modals/DeleteDoubleCheckModal';

type Props = {|
  me: boolean,
  showAuthorContext: boolean,
  message: MessageInfoType,
  canModerateMessage: boolean,
  thread: GetThreadType,
  threadType: 'directMessageThread' | 'story',
  toggleReaction: Function,
  location: Location,
  history: History,
  dispatch: Dispatch<Object>,
  currentUser: UserInfoType,
  deleteMessage: Function,
|};

type State = {
  isEditing: boolean,
};

class Message extends React.Component<Props, State> {
  wrapperRef: React$Node;

  state = { isEditing: false };

  setWrapperRef = (node: React$Node) => {
    this.wrapperRef = node;
  };

  shouldComponentUpdate(nextProps, nextState) {
    const isEditing = this.state.isEditing !== nextState.isEditing;
    const newMessage = nextProps.message.id !== this.props.message.id;
    const updatedReactionCount =
      nextProps.message.reactions.count !== this.props.message.reactions.count;
    const updatedReactionState =
      nextProps.message.reactions.hasReacted !==
      this.props.message.reactions.hasReacted;

    if (
      newMessage ||
      updatedReactionCount ||
      updatedReactionState ||
      isEditing
    ) {
      return true;
    }

    return false;
  }

  toggleOpenGallery = (e: any, selectedMessageId: string) => {
    e.stopPropagation();

    const { thread } = this.props;
    this.props.dispatch(openGallery(thread.id, selectedMessageId));
  };

  deleteMessage = (e: any) => {
    e.stopPropagation();

    if (e.shiftKey) {
      // If Shift key is pressed, we assume confirmation
      return deleteMessageWithToast(
        this.props.dispatch,
        this.props.deleteMessage,
        this.props.message.id
      );
    }

    const message = 'Are you sure you want to delete this message?';

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: this.props.message.id,
        entity: 'message',
        message,
        threadType: this.props.threadType,
        threadId: this.props.thread.id,
      })
    );
  };

  replyToMessage = (e: any) => {
    e.stopPropagation();

    const { thread, message } = this.props;
    return this.props.dispatch(
      replyToMessage({
        threadId: thread.id,
        messageId: message.id,
      })
    );
  };

  // prettier-ignore
  handleSelectMessage = (e: any, selectMessage: Function,	messageId: string) => {
    // $FlowFixMe
    if (window && window.innerWidth < 768 && this.wrapperRef && this.wrapperRef.contains(e.target)) {
      e.stopPropagation();
      return selectMessage(messageId);
    }
  };

  initEditMessage = () => this.setState({ isEditing: true });
  cancelEdit = () => this.setState({ isEditing: false });
  clearSelectedMessage = () => {
    const { history, location } = this.props;
    const { pathname } = location;
    history.push({ pathname });
  };

  render() {
    const {
      showAuthorContext,
      me,
      currentUser,
      dispatch,
      message,
      canModerateMessage,
      toggleReaction,
      thread,
      threadType,
      location,
    } = this.props;
    const { isEditing } = this.state;

    const canEditMessage = me && message.messageType !== 'media';
    const selectedMessageId = btoa(new Date(message.timestamp).getTime() - 1);
    const messageUrl =
      threadType === 'story' && thread
        ? `${getThreadLink(thread)}?m=${selectedMessageId}`
        : threadType === 'directMessageThread'
        ? `/messages/${thread.id}?m=${selectedMessageId}`
        : `/thread/${thread.id}?m=${selectedMessageId}`;

    const searchObj = queryString.parse(location.search);
    const { m = null } = searchObj;
    const isSelected = m && m === selectedMessageId;
    const isOptimistic =
      message && typeof message.id === 'number' && message.id < 0;
    return (
      <ConditionalWrap
        condition={!!isSelected}
        wrap={children => (
          <OutsideClickHandler
            onOutsideClick={this.clearSelectedMessage}
            style={{ width: '100%' }}
          >
            {children}
          </OutsideClickHandler>
        )}
      >
        <OuterMessageContainer
          data-cy={isSelected ? 'message-selected' : 'message'}
          selected={isSelected}
          ref={this.setWrapperRef}
          tabIndex={0}
        >
          <GutterContainer>
            {showAuthorContext ? (
              <AuthorAvatarContainer onClick={e => e.stopPropagation()}>
                <UserAvatar user={message.author.user} size={40} />
              </AuthorAvatarContainer>
            ) : (
              <GutterTimestamp to={messageUrl}>
                {convertTimestampToTime(new Date(message.timestamp))}
              </GutterTimestamp>
            )}
          </GutterContainer>

          <InnerMessageContainer>
            {showAuthorContext && (
              <AuthorByline
                timestamp={message.timestamp}
                user={message.author.user}
                roles={message.author.roles}
                bot={message.bot}
                messageUrl={messageUrl}
              />
            )}

            {!isEditing ? (
              <Body
                me={me}
                openGallery={e => this.toggleOpenGallery(e, message.id)}
                message={message}
              />
            ) : (
              <EditingBody message={message} cancelEdit={this.cancelEdit} />
            )}

            {message.modifiedAt && !isEditing && (
              <Tooltip
                content={`Edited ${convertTimestampToDate(
                  new Date(message.modifiedAt)
                )}`}
              >
                <EditedIndicator data-cy="edited-message-indicator">
                  Edited
                </EditedIndicator>
              </Tooltip>
            )}

            {message.reactions.count > 0 && (
              <Reaction
                message={message}
                toggleReaction={toggleReaction}
                me={me}
                currentUser={currentUser}
                dispatch={dispatch}
                render={({ me, count, hasReacted, mutation }) => (
                  <Tooltip
                    content={me ? 'Likes' : hasReacted ? 'Unlike' : 'Like'}
                  >
                    <ReactionWrapper
                      hasCount={count}
                      hasReacted={hasReacted}
                      me={me}
                      onClick={
                        me
                          ? (e: any) => {
                              e.stopPropagation();
                            }
                          : (e: any) => {
                              e.stopPropagation();
                              mutation();
                            }
                      }
                    >
                      <Icon
                        data-cy={
                          hasReacted
                            ? 'inline-unlike-action'
                            : 'inline-like-action'
                        }
                        glyph="like-fill"
                        size={16}
                        color={'text.reverse'}
                      />
                      <span>{count}</span>
                    </ReactionWrapper>
                  </Tooltip>
                )}
              />
            )}

            {!isEditing && !isOptimistic && (
              <ActionsContainer>
                <Actions>
                  {canEditMessage && (
                    <Tooltip content={'Edit'}>
                      <Action onClick={this.initEditMessage}>
                        <Icon data-cy="edit-message" glyph="edit" size={20} />
                      </Action>
                    </Tooltip>
                  )}

                  {canModerateMessage && (
                    <Tooltip content={'Delete'}>
                      <Action onClick={this.deleteMessage}>
                        <Icon
                          data-cy="delete-message"
                          glyph="delete"
                          size={20}
                        />
                      </Action>
                    </Tooltip>
                  )}

                  <Tooltip content={'Reply'}>
                    <Action onClick={this.replyToMessage}>
                      <Icon
                        data-cy="reply-to-message"
                        glyph="reply"
                        size={20}
                      />
                    </Action>
                  </Tooltip>

                  {!me && (
                    <Reaction
                      message={message}
                      toggleReaction={toggleReaction}
                      me={me}
                      currentUser={currentUser}
                      dispatch={dispatch}
                      render={({ hasReacted, mutation }) => (
                        <Tooltip content={hasReacted ? 'Unlike' : 'Like'}>
                          <LikeAction
                            hasReacted={hasReacted}
                            onClick={e => {
                              e.stopPropagation();
                              mutation();
                            }}
                          >
                            <Icon
                              data-cy={
                                hasReacted ? 'unlike-action' : 'like-action'
                              }
                              glyph={hasReacted ? 'like-fill' : 'like'}
                              size={20}
                            />
                          </LikeAction>
                        </Tooltip>
                      )}
                    />
                  )}

                  {threadType === 'story' && (
                    <Clipboard
                      style={{
                        background: 'none',
                        borderLeft: '1px solid #DFE7EF',
                      }}
                      data-clipboard-text={
                        thread
                          ? `${CLIENT_URL}${getThreadLink(
                              thread
                            )}?m=${selectedMessageId}`
                          : `${CLIENT_URL}/thread/${
                              thread.id
                            }?m=${selectedMessageId}`
                      }
                      onSuccess={() =>
                        this.props.dispatch(
                          addToastWithTimeout('success', 'Copied to clipboard')
                        )
                      }
                    >
                      <Tooltip content={'Link to message'}>
                        <Action>
                          <Icon
                            data-cy="link-to-message"
                            glyph="link"
                            size={20}
                          />
                        </Action>
                      </Tooltip>
                    </Clipboard>
                  )}
                </Actions>
              </ActionsContainer>
            )}
          </InnerMessageContainer>
        </OuterMessageContainer>
      </ConditionalWrap>
    );
  }
}

export default compose(
  deleteMessage,
  withCurrentUser,
  withRouter,
  toggleReactionMutation,
  connect()
)(Message);
