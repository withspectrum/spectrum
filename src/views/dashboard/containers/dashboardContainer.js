//@flow
import React from 'react';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
import { getEverything } from '../queries';
import { Loading } from '../../../components/loading';

// TODO: Brian - figure out how to abstract this out to be used anywhere
const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const DashboardContainerPure = props => {
  console.log(props);

  return <div>foo</div>;
};

export const DashboardContainer = compose(
  getEverything,
  displayLoadingState,
  pure
)(DashboardContainerPure);
