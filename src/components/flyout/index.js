// @flow
import React from 'react';
import styled from 'styled-components';
import { FlexCol, FlexRow, Transition, zIndex } from '../globals';

const StyledFlyout = styled(FlexRow)`
  background-color: ${props => props.theme.bg.default};
  border: 1px solid ${props => props.theme.bg.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: absolute;
  flex: 0 0 auto;
  right: -25%;
  top: 36px;
  z-index: ${zIndex.flyout};
  color: ${({ theme }) => theme.text.default};
  transition: ${Transition.dropdown.off};
`;

const StyledRow = styled(FlexCol)`
  display: flex;
  align-items: stretch;
  position: relative;
`;

const Flyout = (props: Object): React$Element<any> => (
  <StyledFlyout className={'flyout'} {...props}>
    <StyledRow>{props.children}</StyledRow>
  </StyledFlyout>
);

export default Flyout;
