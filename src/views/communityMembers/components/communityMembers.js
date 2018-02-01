// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { Loading } from '../../../components/loading';
import MembersList from './communityMembersList';
import EditDropdown from './editDropdown';
import Search from './search';
import {
  SectionCard,
  SectionTitle,
} from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import {
  Filters,
  Filter,
  SearchFilter,
  SearchInput,
  SearchForm,
} from '../style';
import { ListContainer } from '../../../components/listItems/style';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import ViewError from '../../../components/viewError';
import GranularUserProfile from '../../../components/granularUserProfile';

type Props = {
  id: string,
  client: Object,
  currentUser: Object,
  dispatch: Function,
  history: Object,
  community: Object,
};

type State = {
  filter: ?{
    isMember?: boolean,
    isModerator?: boolean,
    isBlocked?: boolean,
  },
  totalCount: ?number,
  searchIsFocused: boolean,
  // what the user types in
  searchString: string,
  // what gets sent to the server when hits enter
  queryString: string,
};

class CommunityMembers extends React.Component<Props, State> {
  initialState = {
    filter: { isMember: true },
    totalCount: null,
    searchIsFocused: false,
    searchString: '',
    queryString: '',
  };

  state = this.initialState;

  viewMembers = () => {
    return this.setState({
      filter: { isMember: true },
      searchIsFocused: false,
    });
  };

  viewModerators = () => {
    return this.setState({
      filter: {
        isModerator: true,
      },
      searchIsFocused: false,
    });
  };

  viewBlocked = () => {
    return this.setState({
      filter: {
        isBlocked: true,
      },
      searchIsFocused: false,
    });
  };

  setTotalCount = (totalCount: number) => this.setState({ totalCount });

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

  initMessage = user => {
    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  render() {
    const {
      filter,
      totalCount,
      searchIsFocused,
      searchString,
      queryString,
    } = this.state;
    const { id, currentUser } = this.props;

    return (
      <SectionCard>
        <SectionTitle>
          Community Members {totalCount && ` · ${totalCount}`}
        </SectionTitle>

        <Filters>
          <Filter
            onClick={this.viewMembers}
            active={filter && filter.isMember ? true : false}
          >
            Members
          </Filter>
          {/*<Filter
            onClick={this.viewModerators}
            active={filter && filter.isModerator ? true : false}
          >
            Moderators
          </Filter>*/}
          <Filter
            onClick={this.viewBlocked}
            active={filter && filter.isBlocked ? true : false}
          >
            Blocked
          </Filter>

          <SearchFilter onClick={this.initSearch}>
            <SearchForm onSubmit={this.search}>
              <Icon glyph={'search'} size={28} />
              <SearchInput
                onChange={this.handleChange}
                type={'text'}
                placeholder={'Search'}
              />
              {searchString &&
                searchIsFocused && (
                  <Icon glyph={'send-fill'} size={28} onClick={this.search} />
                )}
            </SearchForm>
          </SearchFilter>
        </Filters>

        {searchIsFocused &&
          queryString && (
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
                    {searchResults.map(user => {
                      if (!user) return null;
                      const roles = Object.keys(user.contextPermissions)
                        .filter(r => r !== 'reputation')
                        .filter(r => r !== 'isMember')
                        .filter(r => r !== '__typename')
                        .filter(r => user && user.contextPermissions[r])
                        .map(r => {
                          switch (r) {
                            case 'isOwner':
                              return 'admin';
                            case 'isBlocked':
                              return 'blocked';
                            case 'isModerator':
                              return 'moderator';
                            default:
                              return null;
                          }
                        });

                      if (user.isPro) {
                        roles.push('pro');
                      }

                      const reputation =
                        (user.contextPermissions &&
                          user.contextPermissions.reputation &&
                          user.contextPermissions.reputation.toString()) ||
                        '0';

                      return (
                        <GranularUserProfile
                          key={user.id}
                          id={user.id}
                          name={user.name}
                          username={user.username}
                          description={user.description}
                          isCurrentUser={user.id === currentUser.id}
                          isOnline={user.isOnline}
                          onlineSize={'small'}
                          reputation={reputation}
                          profilePhoto={user.profilePhoto}
                          avatarSize={'40'}
                          badges={roles}
                        >
                          {user.id !== currentUser.id && (
                            <EditDropdown
                              user={user}
                              community={this.props.community}
                            />
                          )}
                        </GranularUserProfile>
                      );
                    })}
                  </ListContainer>
                );
              }}
            />
          )}

        {searchIsFocused &&
          !queryString && (
            <ViewError
              emoji={' '}
              heading={'Search for community members'}
              subheading={
                'Find people by name or description - try searching for "designer"!'
              }
            />
          )}

        {!searchIsFocused && (
          <MembersList
            filter={filter}
            id={id}
            setTotalCount={this.setTotalCount}
          />
        )}
      </SectionCard>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

export default compose(
  // $FlowIssue
  connect(map),
  withApollo
)(CommunityMembers);
