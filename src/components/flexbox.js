// @flow
import React from 'react';
import styled from 'styled-components';

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: ${props => (props.direction ? props.direction : 'row')};
  flex-wrap: ${props => (props.wrap ? props.wrap : 'wrap')};
  justify-content: ${props => (props.justifyContent ? props.justifyContent : 'flex-start')};
  align-items: ${props => (props.alignItems ? props.alignItems : 'flex-start')};
  align-content: ${props => (props.alignContent ? props.alignContent : 'flex-start')};
`;

const StyledFlexChild = styled.div`
  display: flex;
  flex: ${props => (props.flex ? props.flex : '0 1 auto')};
  align-self: ${props => (props.alignSelf ? props.alignSelf : 'flex-start')};
`;

type FlexContainerProps = {
  direction: 'row' | 'column',
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse',
  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around',
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
  alignContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around',
};

type FlexChildProps = {
  flex: String,
  alignSelf:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch',
};

export const FlexContainer = (props: FlexContainerProps) => (
  <StyledFlexContainer {...props} />
);
export const FlexChild = (props: FlexChildProps) => (
  <StyledFlexChild {...props} />
);
