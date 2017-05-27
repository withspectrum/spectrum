// @flow
import React, { Component } from 'react';
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
import {
  ThreadWrapper,
  ThreadHeading,
  Byline,
  ThreadContent,
  ContextRow,
  DropWrap,
  FlyoutRow,
} from '../style';

class ThreadDetailPure extends Component {
  threadLock = (threadId, value) => {
    const { setThreadLock, dispatch } = this.props;

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
  };

  triggerDelete = (e, threadId) => {
    e.preventDefault();
    const { thread, dispatch } = this.props;

    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner =
      thread.channel.community.communityPermissions.isOwner;

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

  triggerEdit = () => {};

  render() {
    const { currentUser, thread } = this.props;

    let body = thread.content.body;
    if (thread.type === 'SLATE') {
      body = toPlainText(toState(JSON.parse(body)));
    }

    const isChannelOwner = thread.channel.channelPermissions.isOwner;
    const isCommunityOwner =
      thread.channel.community.communityPermissions.isOwner;

    return (
      <ThreadWrapper>
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
                      tipText={
                        thread.isLocked ? 'Unfreeze chat' : 'Freeze chat'
                      }
                      tipLocation="top-left"
                      onClick={() =>
                        this.threadLock(thread.id, !thread.isLocked)}
                    />
                  </FlyoutRow>}
                {(thread.isCreator || isChannelOwner || isCommunityOwner) &&
                  <FlyoutRow>
                    <IconButton
                      glyph="delete"
                      hoverColor="warn.alt"
                      tipText="Delete thread"
                      tipLocation="top-left"
                      onClick={e => this.triggerDelete(e, thread.id)}
                    />
                  </FlyoutRow>}
                {thread.isCreator &&
                  <FlyoutRow>
                    <IconButton
                      glyph="edit"
                      hoverColor="text.alt"
                      tipText="Edit"
                      tipLocation="top-left"
                      onClick={() => this.triggerEdit()}
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
  }
}

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
