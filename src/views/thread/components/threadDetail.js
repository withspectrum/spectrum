// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { setThreadLockMutation } from '../mutations';
import { deleteThreadMutation } from '../../../api/thread';
import Icon from '../../../components/icons';
import Flyout from '../../../components/flyout';
import { IconButton } from '../../../components/buttons';
import { toPlainText, toState } from '../../../components/editor';
import {
  ThreadWrapper,
  ThreadHeading,
  Byline,
  ThreadContent,
  ContextRow,
  DropWrap,
  FlyoutRow,
} from '../style';

const ThreadDetailPure = ({
  thread,
  setThreadLock,
  deleteThread,
  dispatch,
  currentUser,
  history,
}) => {
  const isChannelOwner = thread.channel.channelPermissions.isOwner;
  const isCommunityOwner =
    thread.channel.community.communityPermissions.isOwner;
  const isChannelModerator = thread.channel.channelPermissions.isModerator;
  const isCommunityModerator =
    thread.channel.community.communityPermissions.isModerator;

  const threadLock = (threadId, value) =>
    setThreadLock({
      threadId,
      value,
    })
      .then(({ data: { setThreadLock } }) => {
        if (setThreadLock.isLocked) {
          dispatch(addToastWithTimeout('neutral', 'Thread locked.'));
        } else {
          dispatch(addToastWithTimeout('success', 'Thread unlocked!'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });

  const triggerDelete = (e, threadId) => {
    e.preventDefault();

    let message;

    if (isCommunityOwner && !thread.isCreator) {
      message = `You are about to delete another person's thread. As the owner of the ${thread.channel.community.name} community, you have permission to do this. The thread creator will be notified that this thread was deleted.`;
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

  const openUserProfileModal = (e, user: Object) => {
    e.preventDefault();
    return dispatch(openModal('USER_PROFILE_MODAL', { user }));
  };

  let body = thread.content.body;
  if (thread.type === 'SLATE') {
    body = toPlainText(toState(JSON.parse(body)));
  }

  return (
    <ThreadWrapper>
      <ContextRow>
        <Byline onClick={e => openUserProfileModal(e, thread.creator)}>
          {thread.creator.name}
        </Byline>
        {currentUser &&
          (thread.isCreator || isChannelOwner || isCommunityOwner) &&
          <DropWrap>
            <Icon glyph="settings" />
            <Flyout>
              {(isChannelOwner || isCommunityOwner) &&
                <FlyoutRow>
                  <IconButton
                    glyph="freeze"
                    onClick={() => threadLock(thread.id, !thread.isLocked)}
                  />
                </FlyoutRow>}
              {(thread.isCreator || isChannelOwner || isCommunityOwner) &&
                <FlyoutRow>
                  <IconButton
                    glyph="delete"
                    hoverColor="warn.alt"
                    tipText="Delete Thread"
                    tipLocation="bottom-right"
                    onClick={e => triggerDelete(e, thread.id)}
                  />
                </FlyoutRow>}
            </Flyout>
          </DropWrap>}
      </ContextRow>
      <ThreadHeading>
        {thread.content.title}
      </ThreadHeading>
      {!!thread.content.body && <ThreadContent>{body}</ThreadContent>}
    </ThreadWrapper>
  );
};

const ThreadDetail = compose(
  setThreadLockMutation,
  deleteThreadMutation,
  withRouter,
  pure
)(ThreadDetailPure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(ThreadDetail);
