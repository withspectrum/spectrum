// @flow
import React from 'react';
import compose from 'recompose/compose';
import searchUsers from 'shared/graphql/queries/search/searchUsers';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { UserListItem } from 'src/components/entities';
import { SearchResultsWrapper } from '../style';

const UsersSearchResults = (props: Props) => {
  const {
    isLoading,
    hasError,
    queryVarIsChanging,
    data,
    currentUser,
    usersForMessage,
    setUsersForMessage,
    onUserSelected,
  } = props;
  const { search } = data;

  if (isLoading || queryVarIsChanging)
    return <Loading style={{ padding: '32px' }} />;
  if (!search || hasError) return <p>Bad news...</p>;

  const { searchResultsConnection } = search;
  const { edges } = searchResultsConnection;

  if (!edges || edges.length === 0) return <p>No results...</p>;

  const results = edges
    .map(edge => edge && edge.node)
    .filter(user => user.username)
    .filter(Boolean);

  if (results.length === 0) return <p>No results...</p>;

  const handleUserSelection = (selection: Object) => {
    onUserSelected();
    const isAlreadySelected = usersForMessage.find(
      user => user && user.id === selection.id
    );
    if (isAlreadySelected) {
      setUsersForMessage(
        usersForMessage.filter(user => user && user.id !== selection.id)
      );
    } else {
      setUsersForMessage([...usersForMessage, selection]);
    }
  };

  return (
    <SearchResultsWrapper>
      {results.map(user => (
        <UserListItem
          key={user.id}
          userObject={user}
          id={user.id}
          name={user.name}
          username={user.username}
          isCurrentUser={currentUser && user.id === currentUser.id}
          isOnline={user.isOnline}
          profilePhoto={user.profilePhoto}
          avatarSize={40}
          showHoverProfile={false}
          isLink={false}
          onClick={handleUserSelection}
        />
      ))}
    </SearchResultsWrapper>
  );
};

export default compose(
  searchUsers,
  viewNetworkHandler,
  withCurrentUser
)(UsersSearchResults);
