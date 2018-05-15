// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserListItemContainer } from '../style';
import GranularUserProfile from 'src/components/granularUserProfile';
import { Loading } from 'src/components/loading';
import getBlockedUsersQuery from 'shared/graphql/queries/channel/getChannelBlockedUsers';
import type { GetChannelBlockedUsersType } from 'shared/graphql/queries/channel/getChannelBlockedUsers';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
} from 'src/components/settingsViews/style';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { ListContainer, Notice } from 'src/components/listItems/style';
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
    const { data, isLoading, currentUser, unblock, initMessage } = this.props;

    if (data && data.channel) {
      const { blockedUsers } = data.channel;

      return (
        <SectionCard>
          <SectionTitle>Blocked Users</SectionTitle>
          {blockedUsers &&
            blockedUsers.length > 0 && (
              <SectionSubtitle>
                Blocked users can not see threads or messages posted in this
                channel. They will still be able to join any other public
                channels in the Spectrum community and request access to other
                private channels.
              </SectionSubtitle>
            )}

          {blockedUsers &&
            blockedUsers.length > 0 && (
              <Notice>
                Unblocking a user will <b>not</b> add them to this channel. It
                will only allow them to re-request access in the future as long
                as this channel remains private.
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
                      <EditDropdown
                        render={() => (
                          <Dropdown>
                            <DropdownSection
                              style={{ borderBottom: '0' }}
                              onClick={() => initMessage(user)}
                            >
                              <DropdownAction>
                                <Icon glyph={'message'} size={'32'} />
                              </DropdownAction>
                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  Send Direct Message
                                </DropdownSectionTitle>
                              </DropdownSectionText>
                            </DropdownSection>

                            <DropdownSectionDivider />

                            <DropdownSection onClick={() => unblock(user.id)}>
                              <DropdownAction>
                                <Icon glyph={'minus'} size={'32'} />
                              </DropdownAction>

                              <DropdownSectionText>
                                <DropdownSectionTitle>
                                  Unblock
                                </DropdownSectionTitle>
                                <DropdownSectionSubtitle>
                                  Allow this user to re-request access in the
                                  future. They will not be joined to the
                                  channel.
                                </DropdownSectionSubtitle>
                              </DropdownSectionText>
                            </DropdownSection>
                          </Dropdown>
                        )}
                      />
                    </GranularUserProfile>
                  </UserListItemContainer>
                );
              })}

            {blockedUsers &&
              blockedUsers.length <= 0 && (
                <SectionSubtitle>
                  There are no blocked users in this channel.
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
  getBlockedUsersQuery,
  viewNetworkHandler
)(BlockedUsers);
