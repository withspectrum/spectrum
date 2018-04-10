// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import getChannelMembersQuery, {
  type GetChannelMemberConnectionType,
} from 'shared/graphql/queries/channel/getChannelMemberConnection';
import { FlexCol } from 'src/components/globals';
import { Card } from 'src/components/card';
import { LoadingList } from 'src/components/loading';
import GranularUserProfile from 'src/components/granularUserProfile';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import { StyledButton } from '../../community/style';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import { MessageIconContainer, UserListItemContainer } from '../style';
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

class ChannelMemberGrid extends React.Component<Props> {
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

      return (
        <FlexCol
          style={{ padding: '0 16px', flex: 'none', backgroundColor: '#fff' }}
          data-cy="channel-members-list"
        >
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

          {channel.memberConnection &&
            channel.memberConnection.pageInfo.hasNextPage && (
              <StyledButton
                loading={isFetchingMore}
                onClick={() => fetchMore()}
              >
                View more...
              </StyledButton>
            )}
        </FlexCol>
      );
    }

    if (isLoading) {
      return <LoadingList />;
    }

    return (
      <Card>
        <ViewError
          refresh
          heading={'We weren’t able to fetch the members of this channel.'}
        />
      </Card>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  withRouter,
  getChannelMembersQuery,
  viewNetworkHandler
)(ChannelMemberGrid);
