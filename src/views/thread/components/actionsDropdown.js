// @flow
import React, { useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import Flyout from 'src/components/flyout';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import Icon from 'src/components/icon';
import { TextButton } from 'src/components/button';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { FlyoutRow, DropWrap, Label } from '../style';

type Props = {
  thread: Object,
  currentUser: Object,
  toggleNotification: Function,
  toggleEdit: Function,
  isPinningThread: boolean,
  togglePinThread: Function,
  triggerChangeChannel: Function,
  isLockingThread: boolean,
  lockThread: Function,
  triggerDelete: Function,
};

const ActionsDropdown = (props: Props) => {
  const {
    thread,
    currentUser,
    toggleNotification,
    toggleEdit,
    isPinningThread,
    togglePinThread,
    triggerChangeChannel,
    isLockingThread,
    lockThread,
    triggerDelete,
  } = props;

  if (!currentUser) return null;

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

  const shouldRenderEditThreadAction = () => {
    const { isThreadAuthor } = getThreadActionPermissions();
    return isThreadAuthor;
  };

  const shouldRenderMoveThreadAction = () => {
    const {
      isCommunityOwner,
      isCommunityModerator,
    } = getThreadActionPermissions();

    return isCommunityModerator || isCommunityOwner;
  };

  const shouldRenderLockThreadAction = () => {
    const {
      isThreadAuthor,
      isChannelModerator,
      isChannelOwner,
      isCommunityOwner,
      isCommunityModerator,
    } = getThreadActionPermissions();

    return (
      isThreadAuthor ||
      isChannelModerator ||
      isCommunityModerator ||
      isChannelOwner ||
      isCommunityOwner
    );
  };

  const shouldRenderDeleteThreadAction = () => {
    const {
      isThreadAuthor,
      isChannelModerator,
      isChannelOwner,
      isCommunityOwner,
      isCommunityModerator,
    } = getThreadActionPermissions();

    return (
      isThreadAuthor ||
      isChannelModerator ||
      isCommunityModerator ||
      isChannelOwner ||
      isCommunityOwner
    );
  };

  const shouldRenderPinThreadAction = () => {
    const {
      isCommunityOwner,
      isCommunityModerator,
    } = getThreadActionPermissions();

    return (
      !thread.channel.isPrivate && (isCommunityOwner || isCommunityModerator)
    );
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

export default withCurrentUser(ActionsDropdown);
