// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { StyledAppViewWrapper } from './style';

const AppViewWrapper = (props: Object): React$Element<any> => {
  const { currentUser } = props;
  const isSignedIn = currentUser && currentUser.id;
  // Note(@mxstbr): This ID is needed to make infinite scrolling work
  // DO NOT REMOVE IT
  return (
    <StyledAppViewWrapper
      isSignedIn={isSignedIn}
      id="scroller-for-thread-feed"
      {...props}
    />
  );
};

export default compose(
  withRouter,
  withCurrentUser
)(AppViewWrapper);
