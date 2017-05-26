// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
import { Gradient, Tooltip } from './globals';

const Span = styled.span`
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${props => props.theme.text.alt};
  background-image: 'none';
  text-transform: uppercase;
  padding: 2px 4px;
  margin-left: 4px;
  font-size: 9px;
  font-weight: 800;
  border-radius: 4px;
  cursor: pointer;
  ${props => (props.tipText ? Tooltip(props) : '')};
  align-self: center;
  line-height: 1.4;
`;

const ProBadge = styled(Span)`
  background-color: ${props => props.theme.success.alt};
  background-image: ${props => Gradient(props.theme.space.light, props.theme.success.default)}
`;

const Badge = props => {
  switch (props.type) {
    case 'pro':
      return (
        <ProBadge
          type={props.type}
          tipText={props.tipText}
          tipLocation={'top-left'}
          onClick={props.onClick}
        >
          {props.type}
        </ProBadge>
      );
    default:
      return (
        <Span
          type={props.type}
          tipText={props.tipText}
          tipLocation={'top-left'}
          onClick={props.onClick}
        >
          {props.type}
        </Span>
      );
  }
};

export default compose(pure)(Badge);
