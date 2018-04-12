//@flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { MessageIconContainer, UserListItemContainer } from '../style';
import GranularUserProfile from 'src/components/granularUserProfile';
import { TextButton } from 'src/components/buttons';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getPendingUsersQuery from 'shared/graphql/queries/channel/getChannelPendingUsers';
import type { GetChannelPendingUsersType } from 'shared/graphql/queries/channel/getChannelPendingUsers';
import ViewError from 'src/components/viewError';
import { ListContainer } from 'src/components/listItems/style';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from 'src/components/settingsViews/style';
import Icon from 'src/components/icons';

type Props = {
  data: {
    channel: GetChannelPendingUsersType,
  },
  togglePending: Function,
  isLoading: boolean,
  initMessage: Function,
  currentUser: ?Object,
};

class PendingUsers extends React.Component<Props> {
  render() {
    const {
      data,
      isLoading,
      togglePending,
      currentUser,
      initMessage,
    } = this.props;

    if (data && data.channel) {
      const { pendingUsers } = data.channel;

      return (
        <SectionCard>
          <SectionTitle>Pending Members</SectionTitle>
          {pendingUsers.length > 0 && (
            <SectionSubtitle>
              Approving requests will allow a person to view all threads and
              messages in this channel, as well as allow them to post their own
              threads.
            </SectionSubtitle>
          )}

          <ListContainer>
            {pendingUsers &&
              pendingUsers.map(user => {
                if (!user) return null;
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
                      multiAction
                      messageButton={currentUser && user.id !== currentUser.id}
                      description={user.description}
                    >
                      <div
                        style={{
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {/* {currentUser &&
                            user.id !== currentUser.id && (
                              <MessageIconContainer>
                                <Icon
                                  glyph={'message'}
                                  onClick={() => initMessage(user)}
                                />
                              </MessageIconContainer>
                            )} */}
                        <TextButton
                          onClick={() =>
                            user && togglePending(user.id, 'block')
                          }
                          hoverColor={'warn.alt'}
                          icon="minus"
                          style={{ padding: '0' }}
                        >
                          Block
                        </TextButton>

                        <TextButton
                          onClick={() =>
                            user && togglePending(user.id, 'approve')
                          }
                          hoverColor={'success.default'}
                          icon="plus-fill"
                          style={{ padding: '0', marginLeft: '16px' }}
                        >
                          Approve
                        </TextButton>
                      </div>
                    </GranularUserProfile>
                  </UserListItemContainer>
                );
              })}

            {pendingUsers.length <= 0 && (
              <SectionSubtitle>
                There are no pending requests to join this channel.
              </SectionSubtitle>
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
  getPendingUsersQuery,
  viewNetworkHandler
)(PendingUsers);
