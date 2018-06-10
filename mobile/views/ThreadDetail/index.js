// @flow
import * as React from 'react';
import { Share } from 'react-native';
import compose from 'recompose/compose';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import { withCurrentUser } from '../../components/WithCurrentUser';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import Loading from '../../components/Loading';
import { FullscreenNullState } from '../../components/NullStates';
import { Wrapper } from './style';
import {
  ListItemWithButton,
  ListItemWithTitle,
  CommunityListItem,
  UserListItem,
  ListSection,
  ListSectionDivider,
} from '../../components/Lists';
import MutationWrapper from '../../components/MutationWrapper';
import setThreadLockMutation from '../../../shared/graphql/mutations/thread/lockThread';
import toggleThreadNotificationsMutation from '../../../shared/graphql/mutations/thread/toggleThreadNotifications';
import deleteThreadMutation from '../../../shared/graphql/mutations/thread/deleteThread';
import pinThreadMutation from '../../../shared/graphql/mutations/community/pinCommunityThread';
import triggerDeleteAlert from '../../components/DeleteAlert';
import type { GetThreadType } from '../../../shared/graphql/queries/thread/getThread';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import type { NavigationProps } from 'react-navigation';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  currentUser: GetUserType,
  navigation: NavigationProps,
  setThreadLock: Function,
  pinThread: Function,
  deleteThread: Function,
  toggleThreadNotifications: Function,
  data: { thread?: GetThreadType },
};

type State = {
  isDeletingThread: boolean,
};

class ThreadDetail extends React.Component<Props, State> {
  state = {
    isDeletingThread: false,
  };

  shareThread = () => {
    const { thread } = this.props.data;

    if (!thread) return;

    return Share.share(
      {
        url: `https://spectrum.chat/thread/${thread.id}`,
        title: `${thread.content.title}`,
      },
      {
        subject: `${thread.content.title}`,
      }
    );
  };

  initDeleteThread = () => {
    const { data: { thread }, currentUser, deleteThread } = this.props;
    if (!thread) return;

    const isAuthor = currentUser.id === thread.author.user.id;

    return triggerDeleteAlert({
      title: 'Delete this conversation?',
      subtitle: isAuthor
        ? 'This can’t be undone.'
        : 'This can’t be undone. The author will be notified.',
      deleteHandler: () => {
        this.setState({ isDeletingThread: true });
        return deleteThread(thread.id).then(result => {
          this.setState({ isDeletingThread: false });
          return this.handlePostThreadDelete();
        });
      },
    });
  };

  handlePostThreadDelete = () => {
    return this.props.navigation.pop(2);
  };

  render() {
    const {
      data: { thread },
      isLoading,
      hasError,
      navigation,
      currentUser,
    } = this.props;
    const { isDeletingThread } = this.state;

    if (thread && thread.id) {
      const {
        channel: { channelPermissions },
        community: { communityPermissions },
      } = thread;

      const isThreadAuthor = currentUser.id === thread.author.user.id;
      const isChannelModerator = channelPermissions.isModerator;
      const isCommunityModerator = communityPermissions.isModerator;
      const isChannelOwner = channelPermissions.isOwner;
      const isCommunityOwner = communityPermissions.isOwner;
      const canModerateGlobally =
        isChannelModerator ||
        isCommunityModerator ||
        isChannelOwner ||
        isCommunityOwner;
      const canModerateCommunity = isCommunityModerator || isCommunityOwner;
      const isPinned = thread.community.pinnedThreadId === thread.id;

      return (
        <Wrapper>
          <ListSectionDivider />

          <ListSection>
            <CommunityListItem
              onPressHandler={() =>
                navigation.navigate({
                  routeName: 'Community',
                  key: thread.community.id,
                  params: { id: thread.community.id },
                })
              }
              // $FlowFixMe
              community={thread.community}
            />
            <ListItemWithTitle
              onPressHandler={() =>
                navigation.navigate({
                  routeName: 'Channel',
                  key: thread.channel.id,
                  params: { id: thread.channel.id },
                })
              }
              title={thread.channel.name}
              noDivider
            />
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            <UserListItem
              onPressHandler={() =>
                navigation.navigate({
                  routeName: 'User',
                  key: thread.author.user.id,
                  params: { id: thread.author.user.id },
                })
              }
              user={thread.author.user}
              noDivider
            />
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            <ListItemWithButton
              onPressHandler={this.shareThread}
              title={'Share'}
            />

            {canModerateCommunity && (
              <MutationWrapper
                mutation={this.props.pinThread}
                variables={{
                  threadId: thread.id,
                  communityId: thread.community.id,
                  value: isPinned ? null : thread.id,
                }}
                render={({ isLoading, onPressHandler }) => (
                  <ListItemWithButton
                    onPressHandler={onPressHandler}
                    isLoading={isLoading}
                    title={isPinned ? 'Unpin conversation' : 'Pin conversation'}
                  />
                )}
              />
            )}

            {canModerateGlobally && (
              <MutationWrapper
                mutation={this.props.setThreadLock}
                variables={{
                  threadId: thread.id,
                  value: !thread.isLocked,
                }}
                render={({ isLoading, onPressHandler }) => (
                  <ListItemWithButton
                    onPressHandler={onPressHandler}
                    isLoading={isLoading}
                    title={
                      thread.isLocked
                        ? 'Unlock conversation'
                        : 'Lock conversation'
                    }
                  />
                )}
              />
            )}

            <MutationWrapper
              mutation={this.props.toggleThreadNotifications}
              variables={{ threadId: thread.id }}
              render={({ isLoading, onPressHandler }) => (
                <ListItemWithButton
                  onPressHandler={onPressHandler}
                  title={
                    thread.receiveNotifications
                      ? 'Mute conversation'
                      : 'Subscribe to conversation'
                  }
                  noDivider
                />
              )}
            />
          </ListSection>

          <ListSectionDivider />

          {(isThreadAuthor || canModerateGlobally) && (
            <ListSection>
              <ListItemWithButton
                onPressHandler={this.initDeleteThread}
                title={'Delete conversation'}
                type="destructive"
                isLoading={isDeletingThread}
                noDivider
              />
            </ListSection>
          )}
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    return null;
  }
}

export default compose(
  getThreadById,
  withCurrentUser,
  setThreadLockMutation,
  toggleThreadNotificationsMutation,
  pinThreadMutation,
  deleteThreadMutation,
  ViewNetworkHandler
)(ThreadDetail);
