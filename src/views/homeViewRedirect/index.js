// @flow
import React from 'react';
import { withRouter } from 'react-router';
import querystring from 'query-string';
import compose from 'recompose/compose';
import { getCurrentUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import { SERVER_URL } from 'src/api/constants';
import { LoadingView } from 'src/views/viewHelpers';

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
  history.replace('/spectrum');
  // if the user hasn't joined any communities yet, help them find some
  if (!communities || communities.length === 0) {
    history.replace('/explore');
    return null;
  }

  const recentlyActive = communities.sort((a, b) => {
    if (!a.communityPermissions.lastSeen) return 1;
    if (!b.communityPermissions.lastSeen) return -1;

    const x = new Date(a.communityPermissions.lastSeen).getTime();
    const y = new Date(b.communityPermissions.lastSeen).getTime();
    const val = y - x;
    return val;
  })[0];

  if (recentlyActive) {
    history.replace(`/${recentlyActive.slug}`);
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
  history.replace(`/${first.slug}`);
  return null;
};

export default compose(
  getCurrentUserCommunityConnection,
  withRouter
)(HomeViewRedirect);
