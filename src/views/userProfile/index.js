import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import withProps from 'recompose/withProps';
import AppViewWrapper from '../../components/appViewWrapper';
import Loading from '../../components/loading';
import Column from '../../components/column';
import StoryFeed from '../../components/storyFeed';
import { getUser } from './queries';

const UserProfilePure = ({ match }) => {
  const enhance = compose(withProps({ match }), getUser);
  const StoryFeedWithData = enhance(StoryFeed);

  return (
    <AppViewWrapper>
      <Column type="primary" alignItems="center">
        <StoryFeedWithData />
      </Column>
    </AppViewWrapper>
  );
};

export const UserProfile = pure(UserProfilePure);
export default UserProfile;
