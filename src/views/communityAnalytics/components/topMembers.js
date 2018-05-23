// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from 'src/components/icons';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import compose from 'recompose/compose';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import ViewError from 'src/components/viewError';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import GranularUserProfile from 'src/components/granularUserProfile';
import getCommunityTopMembers from 'shared/graphql/queries/community/getCommunityTopMembers';
import type { GetCommunityTopMembersType } from 'shared/graphql/queries/community/getCommunityTopMembers';
import { UserListItemContainer, MessageIconContainer } from '../style';
import type { Dispatch } from 'redux';

type Props = {
  isLoading: boolean,
  data: {
    community: GetCommunityTopMembersType,
  },
  dispatch: Dispatch<Object>,
  history: Object,
  currentUser: ?Object,
};

class ConversationGrowth extends React.Component<Props> {
  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  render() {
    const { data: { community }, isLoading, currentUser } = this.props;

    if (community && community.topMembers.length > 0) {
      const sortedTopMembers = community.topMembers.slice().sort((a, b) => {
        const bc = b && parseInt(b.reputation, 10);
        const ac = a && parseInt(a.reputation, 10);
        return bc && ac && bc <= ac ? -1 : 1;
      });

      return (
        <SectionCard>
          <SectionTitle>Top members this week</SectionTitle>
          {sortedTopMembers.map(member => {
            if (!member) return null;
            return (
              <UserListItemContainer key={member.user.id}>
                <GranularUserProfile
                  userObject={member.user}
                  id={member.user.id}
                  name={member.user.name}
                  username={member.user.username}
                  description={member.user.description}
                  isCurrentUser={
                    currentUser && member.user.id === currentUser.id
                  }
                  isOnline={member.user.isOnline}
                  onlineSize={'small'}
                  reputation={member.reputation}
                  profilePhoto={member.user.profilePhoto}
                  avatarSize={'40'}
                  badges={member.roles}
                >
                  {currentUser &&
                    member.user.id !== currentUser.id && (
                      <MessageIconContainer>
                        <Icon
                          glyph={'message'}
                          onClick={() => this.initMessage(member.user)}
                        />
                      </MessageIconContainer>
                    )}
                </GranularUserProfile>
              </UserListItemContainer>
            );
          })}
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
        <SectionTitle>Top members this week</SectionTitle>
        <ViewError
          small
          emoji={'😭'}
          heading={'Your community has been quiet this week'}
          subheading={
            'When people are posting new threads and joining conversations, the most active people will appear here.'
          }
        />
      </SectionCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  withRouter,
  getCommunityTopMembers,
  viewNetworkHandler
)(ConversationGrowth);
