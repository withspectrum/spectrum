import React, { Component } from 'react';
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import StoryComposer from '../../components/storyComposer';
import Loading from '../../components/loading';
import { getCommunity } from './queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const Container = styled.div``;

class CommunityProfile extends Component {
  render() {
    return (
      <Container>
        <StoryComposer activeCommunity={this.props.data.community.id} />
        <h3>
          {this.props.data.community.name}
        </h3>
      </Container>
    );
  }
}

export default compose(getCommunity, displayLoadingState)(CommunityProfile);
