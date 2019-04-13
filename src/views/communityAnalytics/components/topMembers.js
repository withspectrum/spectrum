// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import ViewError from 'src/components/viewError';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import { UserListItem } from 'src/components/entities';
import getCommunityTopMembers from 'shared/graphql/queries/community/getCommunityTopMembers';
import type { GetCommunityTopMembersType } from 'shared/graphql/queries/community/getCommunityTopMembers';
import { UserListItemContainer } from '../style';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';

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
  render() {
    const {
      data: { community },
      isLoading,
      currentUser,
    } = this.props;
    const title = 'Top members this week';

    if (community) {
      const sortedTopMembers = community.topMembers.slice().sort((a, b) => {
        const bc = b && parseInt(b.reputation, 10);
        const ac = a && parseInt(a.reputation, 10);
        return bc && ac && bc <= ac ? -1 : 1;
      });

      if (sortedTopMembers.length === 0) {
        return (
          <SectionCard>
            <SectionTitle>{title}</SectionTitle>
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

      return (
        <SectionCard>
          <SectionTitle>{title}</SectionTitle>
          {sortedTopMembers.map(member => {
            if (!member) return null;
            return (
              <UserListItemContainer key={member.user.id}>
                <UserListItem
                  userObject={member.user}
                  id={member.user.id}
                  name={member.user.name}
                  username={member.user.username}
                  description={member.user.description}
                  isCurrentUser={
                    currentUser && member.user.id === currentUser.id
                  }
                  isOnline={member.user.isOnline}
                  profilePhoto={member.user.profilePhoto}
                  avatarSize={40}
                  showHoverProfile={false}
                  messageButton={
                    currentUser && member.user.id !== currentUser.id
                  }
                />
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

    return null;
  }
}

export default compose(
  withRouter,
  withCurrentUser,
  getCommunityTopMembers,
  viewNetworkHandler,
  connect()
)(ConversationGrowth);
