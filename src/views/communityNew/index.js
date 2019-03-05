// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { getCommunityByMatch } from 'shared/graphql/queries/community/getCommunity';
import { withCurrentUser } from 'src/components/withCurrentUser';
import CommunityLogin from 'src/views/communityLogin';
import Login from 'src/views/login';
import { CLIENT_URL } from 'src/api/constants';
import type { Props } from './types';
import { LoadingView } from './containers/Loading';
import { ErrorView } from './containers/Error';
import { SignedIn } from './containers/SignedIn';
import { PrivateCommunity } from './containers/PrivateCommunity';
import SideNavbar from 'src/views/sideNavbar';
import { SidenavContext } from './context';

const CommunityView = (props: Props) => {
  const {
    isLoading,
    queryVarIsChanging,
    hasError,
    currentUser,
    match,
    history,
  } = props;

  const [sidenavIsOpen, setSidenavIsOpen] = useState(false);

  const wrapWithSidenav = component => {
    return (
      <SidenavContext.Provider value={{ sidenavIsOpen, setSidenavIsOpen }}>
        <React.Fragment>
          {currentUser && (
            <SideNavbar
              setSidenavIsOpen={setSidenavIsOpen}
              match={match}
              history={history}
            />
          )}

          {component}
        </React.Fragment>
      </SidenavContext.Provider>
    );
  };

  if (isLoading || queryVarIsChanging) return wrapWithSidenav(<LoadingView />);

  const { community } = props.data;

  if (!community || hasError) return wrapWithSidenav(<ErrorView />);

  const { isPrivate, communityPermissions } = community;
  const { isMember, isBlocked } = communityPermissions;

  if (currentUser && !isBlocked && !isPrivate && !isMember)
    return wrapWithSidenav(<SignedIn community={community} />);

  if (isBlocked) return wrapWithSidenav(<ErrorView />);
  if (isPrivate && !currentUser) {
    const redirectPath = `${CLIENT_URL}/${community.slug}`;
    if (community.brandedLogin.isEnabled) {
      return wrapWithSidenav(
        <CommunityLogin redirectPath={redirectPath} match={match} />
      );
    } else {
      return wrapWithSidenav(<Login redirectPath={redirectPath} />);
    }
  }

  if (isPrivate && currentUser && !isMember) {
    return wrapWithSidenav(<PrivateCommunity community={community} />);
  }

  // happy path
  return wrapWithSidenav(<SignedIn community={community} />);
};

export default compose(
  withCurrentUser,
  getCommunityByMatch,
  viewNetworkHandler,
  connect()
)(CommunityView);
