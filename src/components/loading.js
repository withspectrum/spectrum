// @flow
import React from 'react';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
// $FlowFixMe
import styled from 'styled-components';
import { Spinner } from './globals';
import { Card } from './card';

/*
  Creates a container that fills the width and height of its parent
  and absolutely centers a loading spinner inside.

  Loading spinner takes a size and color.
*/
const LoadingContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LoadingCardContainer = styled(Card)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
`;

/*
  Outputs a spinner only with a transparent background that will fill to the width
  and height of its parent. Useful for inline spinners.
*/
export const Loading = ({
  size,
  color,
}: { size: Number, color: String }): React$Element<any> => (
  <LoadingContainer>
    <Spinner size={size} color={color} />
  </LoadingContainer>
);

/*
  Outputs a spinner on top of a card. The card will fill the size of its parent.
  Useful for adding loading states to stories, profile components, the composer,
  etc
*/
export const LoadingCard = ({
  size,
  color,
}: { size: Number, color: String }): React$Element<any> => (
  <LoadingCardContainer>
    <Spinner size={size} color={color} />
  </LoadingCardContainer>
);

export const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(Loading)
);

export const displayLoadingStateAsCard = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingCard)
);
