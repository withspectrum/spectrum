import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import StoryComposer from '../../components/storyComposer';
import AppViewWrapper from '../../components/appViewWrapper';
import Loading from '../../components/loading';
import { getFrequency } from './queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

class FrequencyProfile extends Component {
  render() {
    return (
      <AppViewWrapper>
        <StoryComposer
          activeCommunity={this.props.data.frequency.community.id}
          activeFrequency={this.props.data.frequency.id}
        />
        <h3>
          {this.props.data.frequency.community.name}
          {' '}
          -
          {' '}
          {this.props.data.frequency.name}
        </h3>
      </AppViewWrapper>
    );
  }
}

export default compose(getFrequency, displayLoadingState)(FrequencyProfile);
