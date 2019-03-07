// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { getCommunityByMatch } from 'shared/graphql/queries/community/getCommunity';
import { withCurrentUser } from 'src/components/withCurrentUser';
import CommunityLogin from 'src/views/communityLogin';
import Login from 'src/views/login';
import { CLIENT_URL } from 'src/api/constants';
import type { Props } from './types';
import { ErrorView, LoadingView } from 'src/views/ViewHelpers';
import { SignedIn } from './containers/SignedIn';
import { PrivateCommunity } from './containers/PrivateCommunity';

const CommunityView = (props: Props) => {
  const { isLoading, queryVarIsChanging, hasError, currentUser, match } = props;

  if (isLoading || queryVarIsChanging) return <LoadingView />;

  const { community } = props.data;

  if (!community || hasError) return <ErrorView />;

  const { isPrivate, communityPermissions } = community;
  const { isMember, isBlocked } = communityPermissions;

  if (currentUser && !isBlocked && !isPrivate && !isMember)
    return <SignedIn community={community} />;

  if (isBlocked)
    return (
      <Error
        heading={'We couldn’t load this community'}
        subheading={
          'The community may have been deleted or Spectrum may be running into problems loading it. If you think something has gone wrong, please contact us.'
        }
      />
    );

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
