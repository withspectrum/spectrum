// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { FlexCol } from '../globals';

const StyledCard = styled(FlexCol)`
  background: ${({ theme }) => theme.bg.default};
  position: relative;
  width: 100%;
  max-width: 100%;
  background-clip: padding-box;
  overflow: visible;
  flex: none;

  + div,
  + span {
    margin-top: 16px;

    @media (max-width: 768px) {
      margin-top: 2px;
    }
  }

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const CardPure = (props: Object): React$Element<any> => (
  <StyledCard {...props}>{props.children}</StyledCard>
);

export const Card = compose()(CardPure);
export default Card;
