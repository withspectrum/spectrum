// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter, type Location } from 'react-router';
import Clipboard from 'react-clipboard.js';
import { openGallery } from '../../actions/gallery';
import Reaction from '../reaction';
import { ReactionWrapper } from '../reaction/style';
import { Body } from './view';
import { openModal } from 'src/actions/modals';
import { replyToMessage } from 'src/actions/message';
import { CLIENT_URL } from 'src/api/constants';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import Avatar from 'src/components/avatar';
import { AuthorByline } from '../messageGroup';
import Icon from 'src/components/icons';
import { addToastWithTimeout } from 'src/actions/toasts';
import toggleReactionMutation from 'shared/graphql/mutations/reaction/toggleReaction';
import {
  OuterMessageContainer,
  InnerMessageContainer,
  GutterContainer,
  AuthorAvatarContainer,
  ActionsContainer,
  Actions,
  Action,
  LikeAction,
} from './style';

type Props = {|
  me: boolean,
  showAuthorContext: boolean,
  message: MessageInfoType,
  canModerateMessage: boolean,
  threadType: 'directMessageThread' | 'story',
  threadId: string,
  toggleReaction: Function,
  changeSelection: Function,

  location: Location,
  dispatch: Dispatch<Object>,
  currentUser: UserInfoType,
|};

class Message extends Component<Props> {
  shouldComponentUpdate(nextProps, nextState) {
    const newMessage = nextProps.message.id !== this.props.message.id;
    const updatedReactionCount =
      nextProps.message.reactions.count !== this.props.message.reactions.count;
    const updatedReactionState =
      nextProps.message.reactions.hasReacted !==
      this.props.message.reactions.hasReacted;

    if (newMessage || updatedReactionCount || updatedReactionState) {
      return true;
    }

    return false;
  }

  toggleOpenGallery = messageId => {
    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, messageId));
  };

  deleteMessage = () => {
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

  replyToMessage = () => {
    const { threadId, message } = this.props;
    return this.props.dispatch(
      replyToMessage({
        threadId,
        messageId: message.id,
      })
    );
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
      threadId,
      location,
      threadType,
    } = this.props;

    const hash = btoa(new Date(message.timestamp).getTime());

    let selected = false;
    if (
      location.hash &&
      location.hash.length > 1 &&
      location.hash.substr(1) === hash
    ) {
      selected = true;
    }

    return (
      <OuterMessageContainer data-cy="message" selected={selected}>
        <GutterContainer>
          {showAuthorContext && (
            <AuthorAvatarContainer>
              <Avatar
                src={message.author.user.profilePhoto}
                user={message.author.user}
                isOnline={message.author.user.isOnline}
                size={'40'}
                link={
                  message.author.user.username &&
                  `/users/${message.author.user.username}`
                }
                showProfile
              />
            </AuthorAvatarContainer>
          )}
        </GutterContainer>

        <InnerMessageContainer>
          {showAuthorContext && (
            <AuthorByline
              user={message.author.user}
              roles={message.author.roles}
            />
          )}

          <Body
            me={me}
            openGallery={() => this.toggleOpenGallery(message.id)}
            message={message}
          />

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
                  onClick={me ? () => {} : mutation}
                  tipText={me ? 'Likes' : hasReacted ? 'Unlike' : 'Like'}
                  tipLocation={'top-right'}
                >
                  <Icon glyph="like-fill" size={16} color={'text.reverse'} />
                  <span>{count}</span>
                </ReactionWrapper>
              )}
            />
          )}

          <ActionsContainer>
            <Actions>
              {canModerateMessage && (
                <Action
                  tipText={`Delete`}
                  tipLocation={'top'}
                  onClick={this.deleteMessage}
                >
                  <Icon dataCy="delete-message" glyph="delete" size={20} />
                </Action>
              )}
              <Action
                tipText={`Reply`}
                tipLocation={'top'}
                onClick={this.replyToMessage}
              >
                <Icon dataCy="reply-to-message" glyph="reply" size={20} />
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
                      onClick={mutation}
                    >
                      <Icon
                        dataCy="like-message"
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
                  data-clipboard-text={`${CLIENT_URL}/thread/${threadId}#${hash}`}
                  onSuccess={() =>
                    this.props.dispatch(
                      addToastWithTimeout('success', 'Copied to clipboard')
                    )
                  }
                >
                  <Action tipText={`Link`} tipLocation={'top'}>
                    <Icon dataCy="link-to-message" glyph="link" size={20} />
                  </Action>
                </Clipboard>
              )}
            </Actions>
          </ActionsContainer>
        </InnerMessageContainer>
      </OuterMessageContainer>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowFixMe
  connect(map),
  withRouter,
  toggleReactionMutation
)(Message);
