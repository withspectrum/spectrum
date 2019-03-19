// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { Match } from 'react-router-dom';
import { connect } from 'react-redux';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import {
  getCommunityByMatch,
  type GetCommunityType,
} from 'shared/graphql/queries/community/getCommunity';
import { withCurrentUser } from 'src/components/withCurrentUser';
import CommunityLogin from 'src/views/communityLogin';
import Login from 'src/views/login';
import { CLIENT_URL } from 'src/api/constants';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import { SignedIn } from './containers/signedIn';
import { PrivateCommunity } from './containers/privateCommunity';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  currentUser: ?UserInfoType,
  match: Match,
  data: {
    community: GetCommunityType,
  },
};

const CommunityView = (props: Props) => {
  const { isLoading, queryVarIsChanging, hasError, currentUser, match } = props;

  if (isLoading || queryVarIsChanging) return <LoadingView />;

  const { community } = props.data;

  if (!community || hasError) return <ErrorView />;

  const { isPrivate, communityPermissions } = community;
  const { isMember, isBlocked } = communityPermissions;

  if (currentUser && !isBlocked && !isPrivate && !isMember)
    return <SignedIn community={community} />;

  if (isBlocked) return <ErrorView />;

  if (isPrivate && !currentUser) {
    const redirectPath = `${CLIENT_URL}/${community.slug}`;
    if (community.brandedLogin.isEnabled) {
      return <CommunityLogin redirectPath={redirectPath} match={match} />;
    } else {
      return <Login redirectPath={redirectPath} />;
    }
  }

  if (isPrivate && currentUser && !isMember) {
    return <PrivateCommunity community={community} />;
  }

  return <SignedIn community={community} />;
};

export default compose(
  withCurrentUser,
  getCommunityByMatch,
  viewNetworkHandler,
  connect()
)(CommunityView);
