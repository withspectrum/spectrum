// @flow
import React, { useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { openModal } from 'src/actions/modals';
import { addToastWithTimeout } from 'src/actions/toasts';
import Flyout from 'src/components/flyout';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import Icon from 'src/components/icon';
import { TextButton } from 'src/components/button';
import { withCurrentUser } from 'src/components/withCurrentUser';
import toggleThreadNotificationsMutation from 'shared/graphql/mutations/thread/toggleThreadNotifications';
import pinThreadMutation from 'shared/graphql/mutations/community/pinCommunityThread';
import setThreadLockMutation from 'shared/graphql/mutations/thread/lockThread';
import { FlyoutRow, DropWrap, Label } from '../style';

type Props = {
  thread: Object,
  toggleEdit?: Function,
  // Injected
  currentUser: Object,
  dispatch: Function,
  pinThread: Function,
  toggleThreadNotifications: Function,
  setThreadLock: Function,
};

const ActionsDropdown = (props: Props) => {
  const {
    thread,
    dispatch,
    toggleThreadNotifications,
    currentUser,
    toggleEdit,
    pinThread,
    setThreadLock,
  } = props;
  if (!currentUser) return null;

  const {
    channel: { channelPermissions },
    community: { communityPermissions },
  } = thread;

  const isThreadAuthor =
    currentUser && currentUser.id === thread.author.user.id;
  const isChannelModerator = currentUser && channelPermissions.isModerator;
  const isCommunityModerator = currentUser && communityPermissions.isModerator;
  const isChannelOwner = currentUser && channelPermissions.isOwner;
  const isCommunityOwner = currentUser && communityPermissions.isOwner;

  const shouldRenderEditThreadAction =
    (isThreadAuthor ||
      isChannelModerator ||
      isCommunityModerator ||
      isChannelOwner ||
      isCommunityOwner) &&
    toggleEdit;

  const shouldRenderMoveThreadAction = isCommunityModerator || isCommunityOwner;

  const shouldRenderLockThreadAction =
    isThreadAuthor ||
    isChannelModerator ||
    isCommunityModerator ||
    isChannelOwner ||
    isCommunityOwner;

  const shouldRenderDeleteThreadAction =
    isThreadAuthor ||
    isChannelModerator ||
    isCommunityModerator ||
    isChannelOwner ||
    isCommunityOwner;

  const shouldRenderPinThreadAction =
    !thread.channel.isPrivate && (isCommunityOwner || isCommunityModerator);

  const toggleNotification = () => {
    toggleThreadNotifications({
      threadId: thread.id,
    })
      .then(({ data: { toggleThreadNotifications } }) => {
        if (toggleThreadNotifications.receiveNotifications) {
          return dispatch(
            addToastWithTimeout('success', 'Notifications activated!')
          );
        } else {
          return dispatch(
            addToastWithTimeout('neutral', 'Notifications turned off')
          );
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const triggerChangeChannel = () => {
    dispatch(openModal('CHANGE_CHANNEL', { thread }));
  };

  const isPinned = thread.community.pinnedThreadId === thread.id;
  const [isPinningThread, setIsPinningThread] = React.useState(false);
  const togglePinThread = () => {
    if (thread.channel.isPrivate) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Only threads in public channels can be pinned.'
        )
      );
    }

    setIsPinningThread(true);

    return pinThread({
      threadId: thread.id,
      communityId: thread.community.id,
      value: isPinned ? null : thread.id,
    })
      .then(() => {
        setIsPinningThread(false);
      })
      .catch(err => {
        setIsPinningThread(false);
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const [isLockingThread, setIsLockingThread] = React.useState(false);
  const lockThread = () => {
    const value = !thread.isLocked;
    const threadId = thread.id;

    setIsLockingThread(true);
    setThreadLock({
      threadId,
      value,
    })
      .then(({ data: { setThreadLock } }) => {
        setIsLockingThread(false);
        if (setThreadLock.isLocked) {
          return dispatch(addToastWithTimeout('neutral', 'Thread locked.'));
        } else {
          return dispatch(addToastWithTimeout('success', 'Thread unlocked!'));
        }
      })
      .catch(err => {
        setIsLockingThread(false);
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  const triggerDelete = e => {
    e.preventDefault();

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

    return dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: thread.id,
        entity: 'thread',
        message,
        extraProps: {
          thread,
        },
      })
    );
  };

  const [flyoutOpen, setFlyoutOpen] = useState(false);

  return (
    <DropWrap style={{ marginRight: '8px' }}>
      <Manager>
        <Reference>
          {({ ref }) => {
            return (
              <span ref={ref}>
                <Icon
                  glyph="settings"
                  onClick={() => setFlyoutOpen(!flyoutOpen)}
                  data-cy="thread-actions-dropdown-trigger"
                />
              </span>
            );
          }}
        </Reference>
        {flyoutOpen && (
          <OutsideClickHandler onOutsideClick={() => setFlyoutOpen(false)}>
            <Popper
              modifiers={{
                flip: {
                  boundariesElement: 'viewport',
                  behavior: ['top', 'bottom', 'top'],
                },
                hide: { enable: false },
              }}
            >
              {({ style, ref }) => {
                return (
                  <div
                    ref={ref}
                    style={{
                      position: 'relative',
                      right: '170px',
                      top: '-40px',
                    }}
                  >
                    <Flyout data-cy="thread-actions-dropdown" style={style}>
                      <FlyoutRow>
                        <TextButton
                          onClick={toggleNotification}
                          data-cy={'thread-dropdown-notifications'}
                        >
                          <Icon
                            size={24}
                            glyph={
                              thread.receiveNotifications
                                ? 'notification-fill'
                                : 'notification'
                            }
                          />
                          <Label>
                            {thread.receiveNotifications
                              ? 'Subscribed'
                              : 'Notify me'}
                          </Label>
                        </TextButton>
                      </FlyoutRow>

                      {shouldRenderEditThreadAction && (
                        <FlyoutRow>
                          <TextButton
                            onClick={toggleEdit}
                            data-cy={'thread-dropdown-edit'}
                          >
                            <Icon size={24} glyph={'edit'} />
                            <Label>Edit post</Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderPinThreadAction && (
                        <FlyoutRow>
                          <TextButton
                            onClick={togglePinThread}
                            data-cy={'thread-dropdown-pin'}
                            loading={isPinningThread}
                          >
                            <Icon
                              size={24}
                              glyph={isPinned ? 'pin-fill' : 'pin'}
                            />
                            <Label>
                              {isPinned
                                ? isPinningThread
                                  ? 'Unpinning...'
                                  : 'Unpin thread'
                                : isPinningThread
                                ? 'Pinning...'
                                : 'Pin thread'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderMoveThreadAction && (
                        <FlyoutRow hideBelow={1024}>
                          <TextButton
                            onClick={triggerChangeChannel}
                            data-cy={'thread-dropdown-move'}
                          >
                            <Icon size={24} glyph={'channel'} />
                            <Label>Move thread</Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderLockThreadAction && (
                        <FlyoutRow>
                          <TextButton
                            onClick={lockThread}
                            data-cy={'thread-dropdown-lock'}
                            loading={isLockingThread}
                          >
                            <Icon
                              size={24}
                              glyph={
                                thread.isLocked ? 'private' : 'private-unlocked'
                              }
                            />
                            <Label>
                              {thread.isLocked
                                ? isLockingThread
                                  ? 'Unlocking'
                                  : 'Unlock chat'
                                : isLockingThread
                                ? 'Locking...'
                                : 'Lock chat'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderDeleteThreadAction && (
                        <FlyoutRow>
                          <TextButton
                            onClick={triggerDelete}
                            data-cy={'thread-dropdown-delete'}
                          >
                            <Icon size={24} glyph={'delete'} />
                            <Label>Delete</Label>
                          </TextButton>
                        </FlyoutRow>
                      )}
                    </Flyout>
                  </div>
                );
              }}
            </Popper>
          </OutsideClickHandler>
        )}
      </Manager>
    </DropWrap>
  );
};

export default compose(
  withCurrentUser,
  connect(),
  toggleThreadNotificationsMutation,
  pinThreadMutation,
  setThreadLockMutation
)(ActionsDropdown);
