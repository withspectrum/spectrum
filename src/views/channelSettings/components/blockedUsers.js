// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { MessageIconContainer, UserListItemContainer } from '../style';
import GranularUserProfile from 'src/components/granularUserProfile';
import { TextButton } from 'src/components/buttons';
import { Loading } from 'src/components/loading';
import getBlockedUsersQuery from 'shared/graphql/queries/channel/getChannelBlockedUsers';
import type { GetChannelBlockedUsersType } from 'shared/graphql/queries/channel/getChannelBlockedUsers';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import {
  ListContainer,
  Description,
  Notice,
} from 'src/components/listItems/style';
import Icon from 'src/components/icons';

type Props = {
  data: {
    channel: GetChannelBlockedUsersType,
  },
  unblock: Function,
  isLoading: boolean,
  initMessage: Function,
  currentUser: ?Object,
};

class BlockedUsers extends React.Component<Props> {
  render() {
    const { data, unblock, isLoading, currentUser, initMessage } = this.props;

    if (data && data.channel) {
      const { blockedUsers } = data.channel;

      return (
        <SectionCard>
          <SectionTitle>Blocked Users</SectionTitle>
          {blockedUsers.length > 0 && (
            <Description>
              Blocked users can not see threads or messages posted in this
              channel. They will still be able to join any other public channels
              in the Spectrum community and request access to other private
              channels.
            </Description>
          )}

          {blockedUsers.length > 0 && (
            <Notice>
              Unblocking a user will <b>not</b> add them to this channel. It
              will only allow them to re-request access in the future as long as
              this channel remains private.
            </Notice>
          )}

          <ListContainer>
            {blockedUsers &&
              blockedUsers.map(user => {
                if (!user || !user.id) return null;

                return (
                  <UserListItemContainer key={user.id}>
                    <GranularUserProfile
                      userObject={user}
                      id={user.id}
                      name={user.name}
                      username={user.username}
                      isCurrentUser={currentUser && user.id === currentUser.id}
                      isOnline={user.isOnline}
                      onlineSize={'small'}
                      profilePhoto={user.profilePhoto}
                      avatarSize={'32'}
                      description={user.description}
                    >
                      <div style={{ display: 'flex' }}>
                        <TextButton
                          onClick={() => user && unblock(user.id)}
                          hoverColor={'warn.alt'}
                        >
                          Unblock
                        </TextButton>

                        {currentUser &&
                          user.id !== currentUser.id && (
                            <MessageIconContainer>
                              <Icon
                                glyph={'message'}
                                onClick={() => initMessage(user)}
                              />
                            </MessageIconContainer>
                          )}
                      </div>
                    </GranularUserProfile>
                  </UserListItemContainer>
                );
              })}

            {blockedUsers.length <= 0 && (
              <Description>
                There are no blocked users in this channel.
              </Description>
            )}
          </ListContainer>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError />
      </SectionCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  getBlockedUsersQuery,
  viewNetworkHandler
)(BlockedUsers);
