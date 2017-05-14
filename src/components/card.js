// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { FlexContainer } from './flexbox';
import { Shadow } from './globals';

const StyledCard = styled(FlexContainer)`
  background: ${({ theme }) => theme.bg.default};
  border-radius: 12px;
  box-shadow: ${Shadow.low} rgba(52,113,197, 0.1);
  position: relative;
  width: 100%;
  max-width: 100%;

  + div {
    margin-top: 16px;
  }

  @media(max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const CardPure = (props: Object): React$Element<any> => (
  <StyledCard {...props}>
    {props.children}
  </StyledCard>
);

export const Card = compose(pure)(CardPure);
export default Card;
