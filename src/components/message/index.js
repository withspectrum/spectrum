// @flow
import * as React from 'react';
import { btoa } from 'b2a';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter, type Location, type History } from 'react-router';
import Clipboard from 'react-clipboard.js';
import { openGallery } from 'src/actions/gallery';
import Reaction from 'src/components/reaction';
import { ReactionWrapper } from 'src/components//reaction/style';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import { Body } from './view';
import EditingBody from './editingBody';
import { openModal } from 'src/actions/modals';
import { replyToMessage } from 'src/actions/message';
import { CLIENT_URL } from 'src/api/constants';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { UserAvatar } from 'src/components/avatar';
import AuthorByline from './authorByline';
import Icon from 'src/components/icons';
import { addToastWithTimeout } from 'src/actions/toasts';
import toggleReactionMutation from 'shared/graphql/mutations/reaction/toggleReaction';
import {
  convertTimestampToTime,
  convertTimestampToDate,
} from 'shared/time-formatting';
import { MessagesContext } from 'src/components/messageGroup';
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

type Props = {|
  me: boolean,
  showAuthorContext: boolean,
  message: MessageInfoType,
  canModerateMessage: boolean,
  threadType: 'directMessageThread' | 'story',
  threadId: string,
  thread: GetThreadType,
  toggleReaction: Function,
  location: Location,
  history: History,
  dispatch: Dispatch<Object>,
  currentUser: UserInfoType,
|};

type State = {
  isEditing: boolean,
};

class Message extends React.Component<Props, State> {
  wrapperRef: React.Node;

  state = { isEditing: false };

  setWrapperRef = (node: React.Node) => {
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

    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, selectedMessageId));
  };

  deleteMessage = (e: any) => {
    e.stopPropagation();

    const message = 'Are you sure you want to delete this message?';

    track(
      this.props.threadType === 'story'
        ? events.MESSAGE_DELETED_INITED
        : events.DIRECT_MESSAGE_DELETED_INITED
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: this.props.message.id,
        entity: 'message',
        message,
        threadType: this.props.threadType,
        threadId: this.props.threadId,
      })
    );
  };

  replyToMessage = (e: any) => {
    e.stopPropagation();

    const { threadId, message } = this.props;
    return this.props.dispatch(
      replyToMessage({
        threadId,
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

  render() {
    const {
      showAuthorContext,
      me,
      currentUser,
      dispatch,
      message,
      canModerateMessage,
      toggleReaction,
      threadId,
      threadType,
      thread,
    } = this.props;
    const { isEditing } = this.state;

    const canEditMessage = me && message.messageType !== 'media';
    const selectedMessageId = btoa(new Date(message.timestamp).getTime() - 1);
    const messageUrl =
      threadType === 'story' && thread
        ? `/${getThreadLink(thread)}?m=${selectedMessageId}`
        : threadType === 'directMessageThread'
          ? `/messages/${threadId}?m=${selectedMessageId}`
          : `/thread/${threadId}?m=${selectedMessageId}`;

    return (
      <MessagesContext.Consumer>
        {({ selectedMessage, selectMessage }) => {
          const isSelected =
            selectedMessage && selectedMessage === selectedMessageId;

          return (
            <ConditionalWrap
              condition={isSelected}
              wrap={children => (
                <OutsideClickHandler
                  onOutsideClick={() => selectMessage(null)}
                  style={{ width: '100%' }}
                >
                  {children}
                </OutsideClickHandler>
              )}
            >
              <OuterMessageContainer
                data-cy={isSelected ? 'message-selected' : 'message'}
                selected={selectedMessage === selectedMessageId}
                innerRef={this.setWrapperRef}
                onClick={e =>
                  this.handleSelectMessage(e, selectMessage, selectedMessageId)
                }
              >
                <GutterContainer>
                  {showAuthorContext ? (
                    <AuthorAvatarContainer onClick={e => e.stopPropagation()}>
                      <UserAvatar user={message.author.user} size={40} />
                    </AuthorAvatarContainer>
                  ) : (
                    <GutterTimestamp
                      to={messageUrl}
                      onClick={() => selectMessage(selectedMessageId)}
                    >
                      {convertTimestampToTime(new Date(message.timestamp))}
                    </GutterTimestamp>
                  )}
                </GutterContainer>

                <InnerMessageContainer>
                  {showAuthorContext && (
                    <AuthorByline
                      selectedMessageId={selectedMessageId}
                      timestamp={message.timestamp}
                      user={message.author.user}
                      roles={message.author.roles}
                      messageUrl={messageUrl}
                      selectedMessage={selectedMessage}
                    />
                  )}

                  {!isEditing ? (
                    <Body
                      me={me}
                      openGallery={e => this.toggleOpenGallery(e, message.id)}
                      message={message}
                    />
                  ) : (
                    <EditingBody
                      message={message}
                      cancelEdit={this.cancelEdit}
                    />
                  )}

                  {message.modifiedAt &&
                    !isEditing && (
                      <EditedIndicator
                        data-cy="edited-message-indicator"
                        tipLocation={'top-right'}
                        tipText={`Edited ${convertTimestampToDate(
                          new Date(message.modifiedAt)
                        )}`}
                      >
                        Edited
                      </EditedIndicator>
                    )}

                  {message.reactions.count > 0 && (
                    <Reaction
                      message={message}
                      toggleReaction={toggleReaction}
                      me={me}
                      currentUser={currentUser}
                      dispatch={dispatch}
                      render={({ me, count, hasReacted, mutation }) => (
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
                          tipText={
                            me ? 'Likes' : hasReacted ? 'Unlike' : 'Like'
                          }
                          tipLocation={'top-right'}
                        >
                          <Icon
                            dataCy={
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
                      )}
                    />
                  )}

                  {!isEditing && (
                    <ActionsContainer>
                      <Actions>
                        {canEditMessage && (
                          <Action
                            tipText={`Edit`}
                            tipLocation={'top'}
                            onClick={this.initEditMessage}
                          >
                            <Icon
                              dataCy="edit-message"
                              glyph="edit"
                              size={20}
                            />
                          </Action>
                        )}
                        {canModerateMessage && (
                          <Action
                            tipText={`Delete`}
                            tipLocation={'top'}
                            onClick={this.deleteMessage}
                          >
                            <Icon
                              dataCy="delete-message"
                              glyph="delete"
                              size={20}
                            />
                          </Action>
                        )}
                        <Action
                          tipText={`Reply`}
                          tipLocation={'top'}
                          onClick={this.replyToMessage}
                        >
                          <Icon
                            dataCy="reply-to-message"
                            glyph="reply"
                            size={20}
                          />
                        </Action>

                        {!me && (
                          <Reaction
                            message={message}
                            toggleReaction={toggleReaction}
                            me={me}
                            currentUser={currentUser}
                            dispatch={dispatch}
                            render={({ me, count, hasReacted, mutation }) => (
                              <LikeAction
                                hasReacted={hasReacted}
                                tipText={hasReacted ? 'Unlike' : 'Like'}
                                tipLocation={'top'}
                                onClick={e => {
                                  e.stopPropagation();
                                  mutation();
                                }}
                              >
                                <Icon
                                  dataCy={
                                    hasReacted ? 'unlike-action' : 'like-action'
                                  }
                                  glyph={hasReacted ? 'like-fill' : 'like'}
                                  size={20}
                                />
                              </LikeAction>
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
                                ? `${CLIENT_URL}/${getThreadLink(
                                    thread
                                  )}?m=${selectedMessageId}`
                                : `${CLIENT_URL}/thread/${threadId}?m=${selectedMessageId}`
                            }
                            onSuccess={() =>
                              this.props.dispatch(
                                addToastWithTimeout(
                                  'success',
                                  'Copied to clipboard'
                                )
                              )
                            }
                          >
                            <Action
                              tipText={`Link`}
                              tipLocation={'top'}
                              onClick={e => {
                                e.stopPropagation();
                                selectMessage(selectedMessageId);
                              }}
                            >
                              <Icon
                                dataCy="link-to-message"
                                glyph="link"
                                size={20}
                              />
                            </Action>
                          </Clipboard>
                        )}
                      </Actions>
                    </ActionsContainer>
                  )}
                </InnerMessageContainer>
              </OuterMessageContainer>
            </ConditionalWrap>
          );
        }}
      </MessagesContext.Consumer>
    );
  }
}

export default compose(
  withCurrentUser,
  withRouter,
  toggleReactionMutation,
  connect()
)(Message);
