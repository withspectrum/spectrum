// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import styled from 'styled-components';
import { FlexContainer } from './flexbox';

const StyledColumn = styled(FlexContainer)`
  margin: 0 16px;
  min-width: ${props => (props.type === 'primary' ? '360px' : '240px')};
  flex: ${props => (props.type === 'primary' ? '2 1 60%' : '1 1 30%')};
  max-width: ${props => (props.type === 'primary' ? '640px' : '320px')};

  @media(max-width: 768px) {
    ${props => (props.type === 'primary' ? 'width: 100%;' : 'display: none;')};
    margin: 0;
  }
`;

const ColumnPure = (props: Object): React$Element<any> => (
  <StyledColumn {...props} direction={'column'}>
    {props.children}
  </StyledColumn>
);

export const Column = pure(ColumnPure);
export default Column;
