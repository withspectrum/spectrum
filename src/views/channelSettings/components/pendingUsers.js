//@flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserListItemContainer } from '../style';
import { UserListItem } from 'src/components/entities';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getPendingUsersQuery from 'shared/graphql/queries/channel/getChannelPendingUsers';
import type { GetChannelPendingUsersType } from 'shared/graphql/queries/channel/getChannelPendingUsers';
import ViewError from 'src/components/viewError';
import { ListContainer } from 'src/components/listItems/style';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from 'src/components/settingsViews/style';
import EditDropdown from './editDropdown';
import {
  Dropdown,
  DropdownSectionDivider,
  DropdownSection,
  DropdownSectionSubtitle,
  DropdownSectionText,
  DropdownSectionTitle,
  DropdownAction,
} from 'src/components/settingsViews/style';
import Icon from 'src/components/icon';
import { withCurrentUser } from 'src/components/withCurrentUser';

type Props = {
  data: {
    channel: GetChannelPendingUsersType,
  },
  togglePending: Function,
  isLoading: boolean,
  currentUser: ?Object,
};

class PendingUsers extends React.Component<Props> {
  render() {
    const { data, isLoading, currentUser, togglePending } = this.props;

    if (data && data.channel) {
      const { pendingUsers } = data.channel;

      return (
        <SectionCard>
          <SectionTitle>Pending Members</SectionTitle>
          {pendingUsers && pendingUsers.length > 0 && (
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
                    <UserListItem
                      userObject={user}
                      id={user.id}
                      name={user.name}
                      username={user.username}
                      isCurrentUser={currentUser && user.id === currentUser.id}
                      isOnline={user.isOnline}
                      profilePhoto={user.profilePhoto}
                      avatarSize={40}
                      description={user.description}
                      showHoverProfile={false}
                    >
                      <EditDropdown
                        render={() => (
                          <Dropdown>
                            <InitDirectMessageWrapper
                              user={user}
                              render={
                                <DropdownSection style={{ borderBottom: '0' }}>
                                  <DropdownAction>
                                    <Icon
                                      glyph={'message-simple-new'}
                                      size={'32'}
                                    />
                                  </DropdownAction>
                                  <DropdownSectionText>
                                    <DropdownSectionTitle>
                                      Send Direct Message
                                    </DropdownSectionTitle>
                                  </DropdownSectionText>
                                </DropdownSection>
                              }
                            />

                            <DropdownSectionDivider />

                            <DropdownSection
                              onClick={() => togglePending(user.id, 'approve')}
                            >
                              <DropdownAction>
                                <Icon glyph={'plus'} size={'32'} />
                              </DropdownAction>

                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  Approve
                                </DropdownSectionTitle>
                                <DropdownSectionSubtitle>
                                  This user will be able to see and join all
                                  conversations in this channel
                                </DropdownSectionSubtitle>
                              </DropdownSectionText>
                            </DropdownSection>

                            <DropdownSection
                              onClick={() =>
                                user && togglePending(user.id, 'block')
                              }
                            >
                              <DropdownAction>
                                <Icon glyph={'minus'} size={'32'} />
                              </DropdownAction>

                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  Block
                                </DropdownSectionTitle>
                                <DropdownSectionSubtitle>
                                  Block this user from joining this channel
                                </DropdownSectionSubtitle>
                              </DropdownSectionText>
                            </DropdownSection>
                          </Dropdown>
                        )}
                      />
                    </UserListItem>
                  </UserListItemContainer>
                );
              })}

            {pendingUsers && pendingUsers.length <= 0 && (
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

export default compose(
  getPendingUsersQuery,
  withCurrentUser,
  viewNetworkHandler,
  connect()
)(PendingUsers);
