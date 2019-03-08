// @flow
import React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { getCurrentUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import { SERVER_URL } from 'src/api/constants';
import { LoadingView } from 'src/views/viewHelpers';
import { storeItem, getItemFromStorage } from 'src/helpers/localStorage';

export const LAST_ACTIVE_COMMUNITY_KEY = 'last-active-inbox-community';

const HomeViewRedirect = (props: Props) => {
  const { data, history } = props;
  const { user, loading } = data;

  if (loading) return <LoadingView />;

  // if the user slipped past our route fallback for signed in/out, force
  // a logout and redirect back to the home page
  if (!user) return history.replace(`${SERVER_URL}/auth/logout`);

  const { communityConnection } = user;
  const { edges } = communityConnection;
  const communities = edges.map(edge => edge && edge.node);

  // if the user hasn't joined any communities yet, help them find some
  if (!communities || communities.length === 0) {
    history.replace('/explore');
    return null;
  }

  // if the user has previously been viewing a community, take them back
  const id = getItemFromStorage(LAST_ACTIVE_COMMUNITY_KEY);
  const previouslySelected = communities.find(community => community.id === id);
  if (previouslySelected) {
    history.replace(`/${previouslySelected.slug}`);
    return null;
  }

  const sorted = communities.slice().sort((a, b) => {
    const bc = parseInt(b.communityPermissions.reputation, 10);
    const ac = parseInt(a.communityPermissions.reputation, 10);

    // sort same-reputation communities alphabetically
    if (ac === bc) {
      return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1;
    }

    // otherwise sort by reputation
    return bc <= ac ? -1 : 1;
  });
  const first = sorted[0];
  storeItem(LAST_ACTIVE_COMMUNITY_KEY, first.id);
  history.replace(`/${first.slug}`);
  return null;
};

export default compose(
  getCurrentUserCommunityConnection,
  withRouter
)(HomeViewRedirect);
