// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow, Transition } from '../globals';

const StyledFlyout = styled(FlexRow)`
  background-color: transparent;
  position: absolute;
  flex: 0 0 auto;
  right: 100%;
  top: 0;
  z-index: 5;
  color: ${({ theme }) => theme.text.default};
  transition: ${Transition.dropdown.off};
`;

const StyledRow = styled(FlexRow)`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  position: relative;
  top: -8px;
`;

const FlyoutPure = (props: Object): React$Element<any> => (
  <StyledFlyout className={'flyout'} {...props}>
    <StyledRow>
      {props.children}
    </StyledRow>
  </StyledFlyout>
);

export const Flyout = compose(pure)(FlyoutPure);
export default Flyout;
