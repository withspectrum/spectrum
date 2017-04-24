// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { FlexContainer } from './flexbox';

const StyledCard = styled(FlexContainer)`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px #C9D4E0;
  position: relative;
  width: 100%;
  max-width: 100%;
`;

const CardPure = (props: Object): React$Element<any> => (
  <StyledCard {...props}>
    {props.children}
  </StyledCard>
);

const Card = compose(pure)(CardPure);
export default Card;
