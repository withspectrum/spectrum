//@flow
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Loading } from 'src/components/loading';
import getChannelMembersQuery from 'shared/graphql/queries/channel/getChannelMemberConnection';
import type { GetChannelMemberConnectionType } from 'shared/graphql/queries/channel/getChannelMemberConnection';
import { FetchMoreButton } from 'src/components/threadFeed/style';
import ViewError from 'src/components/viewError';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import GranularUserProfile from 'src/components/granularUserProfile';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import { MessageIconContainer, UserListItemContainer } from '../style';
import { ListContainer, ListFooter } from 'src/components/listItems/style';
import Icon from 'src/components/icons';

type Props = {
  data: {
    channel: GetChannelMemberConnectionType,
    fetchMore: Function,
  },
  isLoading: boolean,
  isFetchingMore: boolean,
  dispatch: Function,
  history: Object,
  currentUser: ?Object,
};

class ChannelMembers extends Component<Props> {
  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    return this.props.history.push('/messages/new');
  };

  render() {
    const {
      data: { channel, fetchMore },
      data,
      isLoading,
      isFetchingMore,
      currentUser,
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
                      avatarSize={'32'}
                      description={user.description}
                    >
                      {currentUser &&
                        user.id !== currentUser.id && (
                          <MessageIconContainer>
                            <Icon
                              glyph={'message'}
                              onClick={() => this.initMessage(user)}
                            />
                          </MessageIconContainer>
                        )}
                    </GranularUserProfile>
                  </UserListItemContainer>
                );
              })}
          </ListContainer>

          {channel.memberConnection.pageInfo.hasNextPage && (
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
  withRouter,
  viewNetworkHandler
)(ChannelMembers);
