// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { Loading } from 'src/components/loading';
import GetMembers from './getMembers';
import queryString from 'query-string';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Filters, Filter, FetchMore, Row } from '../style';
import { ListContainer } from 'src/components/listItems/style';
import ViewError from 'src/components/viewError';
import { UserListItem } from 'src/components/entities';
import { Notice } from 'src/components/listItems/style';
import type { Dispatch } from 'redux';

type Props = {
  id: string,
  client: Object,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  history: Object,
  location: Object,
  community: Object,
};

type State = {
  filter: ?{
    isMember?: boolean,
    isModerator?: boolean,
    isBlocked?: boolean,
    isOwner?: boolean,
  },
};

class CommunityMembers extends React.Component<Props, State> {
  initialState = {
    filter: { isMember: true, isBlocked: false },
  };

  state = this.initialState;

  componentDidMount() {
    const { filter } = queryString.parse(this.props.location.search);
    if (!filter) return;

    if (filter === 'team') {
      return this.viewTeam();
    }
  }

  viewMembers = () => {
    return this.setState({
      filter: { isMember: true, isBlocked: false },
    });
  };

  viewTeam = () => {
    return this.setState({
      filter: { isModerator: true, isOwner: true },
    });
  };

  generateUserProfile = communityMember => {
    const { user } = communityMember;
    return (
      <React.Fragment>
        <Row style={{ position: 'relative' }}>
          <UserListItem
            userObject={user}
            key={user.id}
            id={user.id}
            name={user.name}
            username={user.username}
            description={user.description}
            isCurrentUser={user.id === this.props.currentUser.id}
            profilePhoto={user.profilePhoto}
            avatarSize={40}
            showHoverProfile={false}
            messageButton={user.id !== this.props.currentUser.id}
          />
        </Row>
      </React.Fragment>
    );
  };

  render() {
    const { filter } = this.state;
    const { id, community } = this.props;

    return (
      <SectionCard>
        <SectionTitle>
          Community Members · {community.metaData.members.toLocaleString()}
        </SectionTitle>

        <Filters>
          <Filter
            onClick={this.viewMembers}
            active={filter && filter.isMember ? true : false}
          >
            Members
          </Filter>
          <Filter
            onClick={this.viewTeam}
            active={
              filter && filter.isModerator && filter.isOwner ? true : false
            }
          >
            Team
          </Filter>
        </Filters>

        <GetMembers
          filter={filter}
          id={id}
          render={({ isLoading, community, isFetchingMore, fetchMore }) => {
            const members =
              community &&
              community.members &&
              community.members.edges.map(member => member && member.node);

            if (members && members.length > 0) {
              return (
                <ListContainer data-cy="community-settings-members-list">
                  {filter && filter.isBlocked && !community.isPrivate && (
                    <Notice>
                      <strong>A note about blocked users:</strong> Your
                      community is publicly viewable (except for private
                      channels). This means that a blocked user may be able to
                      see the content and conversations in your community.
                      However, they will be prevented from creating new
                      conversations, or leaving messages in existing
                      conversations.
                    </Notice>
                  )}

                  {members.map(communityMember => {
                    if (!communityMember) return null;
                    return this.generateUserProfile(communityMember);
                  })}

                  {community && community.members.pageInfo.hasNextPage && (
                    <SectionCardFooter>
                      <FetchMore
                        color={'brand.default'}
                        loading={isFetchingMore}
                        onClick={fetchMore}
                      >
                        {isFetchingMore ? 'Loading...' : 'Load more'}
                      </FetchMore>
                    </SectionCardFooter>
                  )}
                </ListContainer>
              );
            }

            if (isLoading) {
              return <Loading />;
            }

            if (!members || members.length === 0) {
              if (filter && filter.isBlocked) {
                return (
                  <ViewError
                    emoji={' '}
                    heading={'No blocked members found'}
                    subheading={
                      'Nobody has been blocked yet - nice! When someone is blocked, they will appear here'
                    }
                  />
                );
              }

              if (filter && filter.isMember) {
                return (
                  <ViewError
                    emoji={' '}
                    heading={'No members found'}
                    subheading={
                      "We couldn't find any members in your community. That's strange..."
                    }
                  />
                );
              }

              if (filter && filter.isModerator && filter.isOwner) {
                return (
                  <ViewError
                    emoji={' '}
                    heading={'No team members found'}
                    subheading={
                      "You haven't added any team members to your community yet."
                    }
                  />
                );
              }
            }

            return null;
          }}
        />
      </SectionCard>
    );
  }
}

export default compose(
  withApollo,
  withCurrentUser,
  withRouter,
  connect()
)(CommunityMembers);
