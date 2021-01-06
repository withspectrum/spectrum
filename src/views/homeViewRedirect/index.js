// @flow
import React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import { SERVER_URL } from 'src/api/constants';
import { LoadingView } from 'src/views/viewHelpers';
import type { History } from 'react-router';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
    loading: boolean,
  },
  history: History,
};

const HomeViewRedirect = (props: Props) => {
  console.log(' home view redirect');
  const { data, history } = props;
  const { user, loading } = data;

  if (loading) return <LoadingView />;

  console.log({ user });

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

  // If at least one community has `lastSeen` redirect to it
  if (
    communities.some(community => !!community.communityPermissions.lastSeen)
  ) {
    const sorted = communities.filter(Boolean).sort((a, b) => {
      if (!a.communityPermissions.lastSeen) return 1;
      if (!b.communityPermissions.lastSeen) return -1;

      const x = new Date(a.communityPermissions.lastSeen).getTime();
      // $FlowIssue Flow you drunk
      const y = new Date(b.communityPermissions.lastSeen).getTime();
      const val = y - x;
      return val;
    });

    history.replace(`/${sorted[0].slug}`);
    return null;
  }

  // Otherwise select the first one by rep
  const sorted = communities
    .slice()
    .filter(Boolean)
    .sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);

      // sort same-reputation communities alphabetically
      if (ac === bc) {
        return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1;
      }

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
