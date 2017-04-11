import React from 'react';
import styled from 'styled-components';
import { Gradient, Tooltip } from '../Globals';

const Span = styled.span`
	color: ${({ theme }) => theme.text.reverse};
	background-color: ${props =>
  props.type === 'pro' ? props.theme.success.alt : props.theme.text.alt};
  background-image: ${props =>
  props.type === 'pro'
    ? Gradient(props.theme.success.alt, props.theme.space.light)
    : 'none'};
	text-transform: uppercase;
	padding: 2px 4px;
	margin-left: 4px;
	font-size: 9px;
	font-weight: 800;
	border-radius: 4px;
  ${props => props.tipText ? 'cursor: pointer;' : ''};
  ${props => props.tipText ? Tooltip(props) : ''};
	align-self: center;
`;

const Badge = props => {
  return (
    <Span
      type={props.type}
      tipText={props.tipText}
      tipLocation={props.tipLocation}
      onClick={props.onClick}
    >
      {props.type}
    </Span>
  );
};

export default Badge;
