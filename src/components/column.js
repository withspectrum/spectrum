// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import styled from 'styled-components';
import { FlexCol } from './globals';

const StyledColumn = styled(FlexCol)`
  margin: 0 16px;
  align-items: stretch;
  min-width: ${props => (props.type === 'primary' ? '360px' : '240px')};
  flex: ${props => (props.type === 'primary' ? '2 1 60%' : '1 1 30%')};
  max-width: ${props => (props.type === 'primary' ? '640px' : '320px')};

  @media(max-width: 768px) {
    ${props => (props.type === 'primary' ? 'width: 100%;' : 'display: none;')};
    margin: 0;
    max-width: 100%;
    background-color: ${({ theme }) => theme.border.default};
  }
`;

const ColumnPure = (props: Object): React$Element<any> => (
  <StyledColumn {...props}>
    {props.children}
  </StyledColumn>
);

export const Column = pure(ColumnPure);
export default Column;
