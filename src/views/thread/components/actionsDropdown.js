// @flow
import React, { useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { openModal } from 'src/actions/modals';
import Flyout from 'src/components/flyout';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import Icon from 'src/components/icon';
import { TextButton } from 'src/components/button';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { FlyoutRow, DropWrap, Label } from '../style';

type Props = {
  thread: Object,
  // Injected
  currentUser: Object,
  dispatch: Function,
};

const ActionsDropdown = (props: Props) => {
  const { thread, dispatch, currentUser } = props;
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

  const shouldRenderDeleteThreadAction =
    isThreadAuthor ||
    isChannelModerator ||
    isCommunityModerator ||
    isChannelOwner ||
    isCommunityOwner;

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

  if (!shouldRenderDeleteThreadAction) {
    return null;
  }

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
  connect()
)(ActionsDropdown);
