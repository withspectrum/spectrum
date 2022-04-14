// @flow
import theme from 'shared/theme';
import React from 'react';
import compose from 'recompose/compose';
import styled from 'styled-components';
import { FlexCol } from '../globals';
import { MEDIA_BREAK } from 'src/components/layout';

const StyledCard = styled(FlexCol)`
  background: ${theme.bg.default};
  position: relative;
  width: 100%;
  max-width: 100%;
  background-clip: padding-box;
  overflow: visible;
  flex: none;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const CardPure = (props: Object): React$Element<any> => (
  <StyledCard {...props}>{props.children}</StyledCard>
);

export const Card = compose()(CardPure);
export default Card;
