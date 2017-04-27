import React, { Component } from 'react';
import styled from 'styled-components';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';

import Loading from '../../components/loading';
import { getFrequency } from './queries';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const Container = styled.div``;

class FrequencyProfile extends Component {
  render() {
    return (
      <Container>
        <h3>
          {this.props.data.frequency.community.name}
          {' '}
          -
          {' '}
          {this.props.data.frequency.name}
        </h3>
      </Container>
    );
  }
}

export default compose(getFrequency, displayLoadingState)(FrequencyProfile);
