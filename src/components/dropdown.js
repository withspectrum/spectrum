// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { Shadow, FlexCol, hexa, Transition } from './globals';
import Card from './card';

const StyledDropdown = styled(FlexCol)`
  background-color: transparent;
  position: absolute;
  width: 400px;
  top: 100%;
  right: 0px;
  z-index: 5;
  padding-top: 8px;
  color: ${({ theme }) => theme.text.default};
  transition: ${Transition.dropdown.off};
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  padding: 16px 0 8px 0;
  box-shadow: ${Shadow.high} ${({ theme }) => hexa(theme.text.placeholder, 0.5)};
  max-height: 640px;
  overflow-y: hidden;
`;

const DropdownPure = (props: Object): React$Element<any> => (
  <StyledDropdown className={'dropdown'} {...props}>
    <StyledCard>
      {props.children}
    </StyledCard>
  </StyledDropdown>
);

export const Dropdown = compose(pure)(DropdownPure);
export default Dropdown;
