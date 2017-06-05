import React from 'react';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import { LoadingContainer, Spinner } from './style';

export const Loading = ({
  size,
  color,
}: { size?: Number, color?: String }): React$Element<any> => (
  <LoadingContainer>
    <Spinner size={size} color={color} />
  </LoadingContainer>
);

export const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);
