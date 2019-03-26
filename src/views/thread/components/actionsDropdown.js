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
import { track, events, transformations } from 'src/helpers/analytics';
import { FlyoutRow, DropWrap, Label } from '../style';

type Props = {
  thread: Object,
  toggleEdit: Function,
  isPinningThread: boolean,
  togglePinThread: Function,
  isLockingThread: boolean,
  lockThread: Function,
  triggerDelete: Function,
  // Injected
  currentUser: Object,
  dispatch: Function,
  toggleThreadNotifications: Function,
};

const ActionsDropdown = (props: Props) => {
  const {
    thread,
    dispatch,
    toggleThreadNotifications,
    currentUser,
    toggleEdit,
    isPinningThread,
    togglePinThread,
    isLockingThread,
    lockThread,
    triggerDelete,
  } = props;

  const getThreadActionPermissions = () => {
    const {
      channel: { channelPermissions },
      community: { communityPermissions },
    } = thread;

    const isThreadAuthor =
      currentUser && currentUser.id === thread.author.user.id;
    const isChannelModerator = currentUser && channelPermissions.isModerator;
    const isCommunityModerator =
      currentUser && communityPermissions.isModerator;
    const isChannelOwner = currentUser && channelPermissions.isOwner;
    const isCommunityOwner = currentUser && communityPermissions.isOwner;

    return {
      isThreadAuthor,
      isChannelModerator,
      isCommunityModerator,
      isChannelOwner,
      isCommunityOwner,
    };
  };

  const {
    isThreadAuthor,
    isChannelModerator,
    isCommunityModerator,
    isChannelOwner,
    isCommunityOwner,
  } = getThreadActionPermissions();
  if (!currentUser) return null;

  const shouldRenderEditThreadAction = () => {
    return (
      isThreadAuthor ||
      isChannelModerator ||
      isCommunityModerator ||
      isChannelOwner ||
      isCommunityOwner
    );
  };

  const shouldRenderMoveThreadAction = () => {
    return isCommunityModerator || isCommunityOwner;
  };

  const shouldRenderLockThreadAction = () => {
    return (
      isThreadAuthor ||
      isChannelModerator ||
      isCommunityModerator ||
      isChannelOwner ||
      isCommunityOwner
    );
  };

  const shouldRenderDeleteThreadAction = () => {
    return (
      isThreadAuthor ||
      isChannelModerator ||
      isCommunityModerator ||
      isChannelOwner ||
      isCommunityOwner
    );
  };

  const shouldRenderPinThreadAction = () => {
    return (
      !thread.channel.isPrivate && (isCommunityOwner || isCommunityModerator)
    );
  };

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
    track(events.THREAD_MOVED_INITED, {
      thread: transformations.analyticsThread(thread),
      channel: transformations.analyticsChannel(thread.channel),
      community: transformations.analyticsCommunity(thread.community),
    });

    dispatch(openModal('CHANGE_CHANNEL', { thread }));
  };

  const isPinned = thread.community.pinnedThreadId === thread.id;

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
                  dataCy="thread-actions-dropdown-trigger"
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
                          {thread.receiveNotifications
                            ? 'Subscribed'
                            : 'Notify me'}
                        </TextButton>
                      </FlyoutRow>

                      {shouldRenderEditThreadAction() && (
                        <FlyoutRow>
                          <TextButton
                            onClick={toggleEdit}
                            data-cy={'thread-dropdown-edit'}
                            style={{
                              borderTop: '1px solid transparent',
                            }}
                          >
                            <Icon size={24} glyph={'edit'} />
                            <Label>Edit post</Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderPinThreadAction() && (
                        <FlyoutRow>
                          <TextButton
                            onClick={togglePinThread}
                            data-cy={'thread-dropdown-pin'}
                            loading={isPinningThread}
                            disabled={isPinningThread}
                          >
                            <Icon
                              size={24}
                              glyph={isPinned ? 'pin-fill' : 'pin'}
                            />
                            <Label>
                              {isPinned ? 'Unpin thread' : 'Pin thread'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderMoveThreadAction() && (
                        <FlyoutRow hideBelow={1024}>
                          <TextButton
                            onClick={triggerChangeChannel}
                            data-cy={'thread-dropdown-move'}
                          >
                            <Icon size={24} glyph={'channel'} />
                            Move thread
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderLockThreadAction() && (
                        <FlyoutRow>
                          <TextButton
                            onClick={lockThread}
                            data-cy={'thread-dropdown-lock'}
                            loading={isLockingThread}
                            disabled={isLockingThread}
                          >
                            <Icon
                              size={24}
                              glyph={
                                thread.isLocked ? 'private' : 'private-unlocked'
                              }
                            />
                            <Label>
                              {thread.isLocked ? 'Unlock chat' : 'Lock chat'}
                            </Label>
                          </TextButton>
                        </FlyoutRow>
                      )}

                      {shouldRenderDeleteThreadAction() && (
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
  toggleThreadNotificationsMutation
)(ActionsDropdown);
