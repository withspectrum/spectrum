import React, { Component } from 'react';
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Loading from '../../components/loading';
import { getCommunity } from './queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const CommunityProfilePure = ({ data: { community } }) => (
  <AppViewWrapper>
    <StoryComposer activeCommunity={community.id} />
    <h3>
      {community.name}
    </h3>
  </AppViewWrapper>
);

const CommunityProfile = compose(getCommunity, displayLoadingState)(
  CommunityProfilePure
);
export default CommunityProfile;
