//@flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Loading } from 'src/components/loading';
import getChannelMembersQuery from 'shared/graphql/queries/channel/getChannelMemberConnection';
import type { GetChannelMemberConnectionType } from 'shared/graphql/queries/channel/getChannelMemberConnection';
import { FetchMoreButton } from 'src/components/threadFeed/style';
import ViewError from 'src/components/viewError';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import GranularUserProfile from 'src/components/granularUserProfile';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import { MessageIconContainer, UserListItemContainer } from '../style';
import { ListContainer, ListFooter } from 'src/components/listItems/style';
import Icon from 'src/components/icons';
import type { Dispatch } from 'redux';

type Props = {
  data: {
    channel: GetChannelMemberConnectionType,
    fetchMore: Function,
  },
  isLoading: boolean,
  isFetchingMore: boolean,
  dispatch: Dispatch<Object>,
  initMessage: Function,
  currentUser: ?Object,
};

class ChannelMembers extends Component<Props> {
  render() {
    const {
      data: { channel, fetchMore },
      data,
      isLoading,
      isFetchingMore,
      currentUser,
      initMessage,
    } = this.props;

    if (data && data.channel) {
      const members =
        channel.memberConnection &&
        channel.memberConnection.edges.map(member => member && member.node);
      const totalCount =
        channel.metaData && channel.metaData.members.toLocaleString();

      return (
        <SectionCard>
          <SectionTitle>
            {totalCount === 1
              ? `${totalCount} member`
              : `${totalCount} members`}
          </SectionTitle>

          <ListContainer>
            {members &&
              members.map(user => {
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
                      avatarSize={32}
                      description={user.description}
                      showHoverProfile={false}
                    >
                      {currentUser &&
                        user.id !== currentUser.id && (
                          <MessageIconContainer>
                            <Icon
                              glyph={'message'}
                              onClick={() => initMessage(user)}
                            />
                          </MessageIconContainer>
                        )}
                    </GranularUserProfile>
                  </UserListItemContainer>
                );
              })}
          </ListContainer>

          {channel.memberConnection &&
            channel.memberConnection.pageInfo.hasNextPage && (
              <ListFooter>
                <FetchMoreButton
                  color={'brand.default'}
                  loading={isFetchingMore}
                  onClick={() => fetchMore()}
                >
                  Load more
                </FetchMoreButton>
              </ListFooter>
            )}
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
  getChannelMembersQuery,
  viewNetworkHandler
)(ChannelMembers);
