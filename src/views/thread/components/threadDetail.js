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
import { LinkPreview } from '../../../components/linkPreview';
import Titlebar from '../../titlebar';
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

  let body = thread.content.body;
  if (thread.type === 'SLATE') {
    body = toPlainText(toState(JSON.parse(body)));
  }

  return (
    <ThreadWrapper>
      <Titlebar
        title={thread.content.title}
        subtitle={`Thread by ${thread.creator.name}`}
      />

      <ContextRow>
        <Byline to={`/users/${thread.creator.username}`}>
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
                    hoverColor="space.light"
                    tipText={thread.isLocked ? 'Unfreeze chat' : 'Freeze chat'}
                    tipLocation="top-left"
                    onClick={() => threadLock(thread.id, !thread.isLocked)}
                  />
                </FlyoutRow>}
              {(thread.isCreator || isChannelOwner || isCommunityOwner) &&
                <FlyoutRow>
                  <IconButton
                    glyph="delete"
                    hoverColor="warn.alt"
                    tipText="Delete thread"
                    tipLocation="top-left"
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
      {// for now we know this means there is a link attachment
      thread.attachments &&
        thread.attachments.length > 0 &&
        <LinkPreview
          trueUrl={thread.attachments[0].data.trueUrl}
          data={JSON.parse(thread.attachments[0].data)}
          size={'small'}
          editable={false}
          margin={'16px 0 0 0'}
        />}
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
