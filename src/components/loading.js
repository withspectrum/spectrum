// @flow
import React from 'react';
// $FlowFixMe
import styled from 'styled-components';
import { Spinner } from './globals';

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

const Loading = ({ size, color }: { size: Number, color: String }) => (
  <LoadingContainer>
    <Spinner size={size} color={color} />
  </LoadingContainer>
);

export default Loading;
