// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { FlexContainer } from './flexbox';

const StyledColumn = styled(FlexContainer)`
  margin: 0 16px;
  ${props => (props.type === 'primary' ? 'width: 560px;' : 'width: 320px;')}
`;

const ColumnPure = (props: Object): React$Element<any> => (
  <StyledColumn {...props} direction={'column'}>
    {props.children}
  </StyledColumn>
);

export const Column = compose(pure)(ColumnPure);
