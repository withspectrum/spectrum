// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { Loading } from 'src/components/loading';
import GetMembers from './getMembers';
import EditDropdown from './editDropdown';
import Search from './search';
import queryString from 'query-string';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import Icon from 'src/components/icon';
import {
  Filters,
  Filter,
  SearchFilter,
  SearchInput,
  SearchForm,
  FetchMore,
  Row,
} from '../style';
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
  searchIsFocused: boolean,
  // what the user types in
  searchString: string,
  // what gets sent to the server when hits enter
  queryString: string,
};

class CommunityMembers extends React.Component<Props, State> {
  initialState = {
    filter: { isMember: true, isBlocked: false },
    searchIsFocused: false,
    searchString: '',
    queryString: '',
  };

  state = this.initialState;

  componentDidMount() {
    const { filter } = queryString.parse(this.props.location.search);
    if (!filter) return;

    if (filter === 'pending') {
      return this.viewPending();
    }

    if (filter === 'team') {
      return this.viewTeam();
    }

    if (filter === 'blocked') {
      return this.viewBlocked();
    }
  }

  viewMembers = () => {
    return this.setState({
      filter: { isMember: true, isBlocked: false },
      searchIsFocused: false,
    });
  };

  viewPending = () => {
    return this.setState({
      filter: { isPending: true },
      searchIsFocused: false,
    });
  };

  viewTeam = () => {
    return this.setState({
      filter: { isModerator: true, isOwner: true },
      searchIsFocused: false,
    });
  };

  viewBlocked = () => {
    return this.setState({
      filter: { isBlocked: true },
      searchIsFocused: false,
    });
  };

  handleChange = (e: any) => {
    const searchString = e.target && e.target.value;

    if (!searchString || searchString.length === 0) {
      return this.setState({
        searchString: '',
        queryString: '',
      });
    }

    return this.setState({
      searchString: searchString,
    });
  };

  initSearch = () => this.setState({ filter: null, searchIsFocused: true });

  search = e => {
    e.preventDefault();
    const { searchString } = this.state;
    if (!searchString || searchString.length === 0) return;
    return this.setState({ queryString: searchString });
  };

  generateUserProfile = communityMember => {
    const { user, ...permissions } = communityMember;
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
            isOnline={user.isOnline}
            profilePhoto={user.profilePhoto}
            avatarSize={40}
            showHoverProfile={false}
            messageButton={user.id !== this.props.currentUser.id}
          />
          {user.id !== this.props.currentUser.id && (
            <EditDropdown
              user={user}
              permissions={permissions}
              community={this.props.community}
            />
          )}
        </Row>
      </React.Fragment>
    );
  };

  render() {
    const { filter, searchIsFocused, searchString, queryString } = this.state;
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
          <Filter
            onClick={this.viewBlocked}
            active={filter && filter.isBlocked ? true : false}
          >
            Blocked
          </Filter>

          {community.isPrivate && (
            <Filter
              onClick={this.viewPending}
              active={filter && filter.isPending ? true : false}
            >
              Pending
            </Filter>
          )}

          <SearchFilter onClick={this.initSearch}>
            <SearchForm onSubmit={this.search}>
              <Icon glyph={'search'} size={28} />
              <SearchInput
                onChange={this.handleChange}
                type={'text'}
                placeholder={'Search'}
              />
            </SearchForm>
          </SearchFilter>
        </Filters>

        {searchIsFocused && queryString && (
          <Search
            queryString={queryString}
            filter={{ communityId: this.props.id }}
            render={({ searchResults, isLoading }) => {
              if (isLoading) {
                return <Loading />;
              }

              if (!searchResults || searchResults.length === 0) {
                const emoji = ' ';

                const heading =
                  searchString.length > 1
                    ? `We couldn't find anyone matching "${searchString}"`
                    : 'Search for people in your community';

                const subheading =
                  searchString.length > 1
                    ? 'Grow your community by inviting people via email, or by importing a Slack team'
                    : 'Find people by name, username, and profile description - try searching for "designer" or "developer"';

                return (
                  <ViewError
                    emoji={emoji}
                    heading={heading}
                    subheading={subheading}
                  />
                );
              }

              return (
                <ListContainer>
                  {searchResults.map(communityMember => {
                    if (!communityMember) return null;
                    return this.generateUserProfile(communityMember);
                  })}
                </ListContainer>
              );
            }}
          />
        )}

        {searchIsFocused && !queryString && (
          <ViewError
            emoji={' '}
            heading={'Search for community members'}
            subheading={
              'Find people by name or description - try searching for "designer"!'
            }
          />
        )}

        {!searchIsFocused && (
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

                if (filter && filter.isPending) {
                  return (
                    <ViewError
                      emoji={' '}
                      heading={'No pending members found'}
                      subheading={
                        'There are no pending members in your community.'
                      }
                    />
                  );
                }
              }

              return null;
            }}
          />
        )}
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
