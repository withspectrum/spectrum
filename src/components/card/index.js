// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { FlexCol, Shadow, hexa } from '../globals';

const StyledCard = styled(FlexCol)`
  background: ${({ theme }) => theme.bg.default};
  border-radius: 12px;
  box-shadow: ${Shadow.low} ${({ theme }) => hexa(theme.text.placeholder, 0.25)};
  position: relative;
  width: 100%;
  max-width: 100%;
  background-clip: padding-box;
  overflow: visible;

  + div,
  + span {
    margin-top: 16px;

    @media(max-width: 768px) {
      margin-top: 2px;
    }
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
