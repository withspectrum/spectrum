// @flow
// $FlowFixMe
import styled, { css } from 'styled-components';
import { Gradient, Transition } from '../globals';

export const ReactionWrapper = styled.b`
	position: absolute;
	bottom: 0;
	${props => (props.me ? 'right: calc(100% - 8px)' : 'left: calc(100% - 8px)')};
  min-width: ${props => (props.hasCount ? '44px' : 'auto')};
	max-width: ${props => (props.hasCount ? '100%' : '12px')};
	max-height: ${props => (props.hasCount ? '24px' : '12px')};
  color: ${props => props.theme.text.reverse};
	border: 2px solid #fff;
	border-radius: ${props => (props.hasCount ? '24px' : '8px')};

	${props => (props.hasCount ? `background-color: ${props.active ? props.theme.warn.default : props.theme.text.alt};
		background-image: ${props.active ? Gradient(props.theme.warn.alt, props.theme.warn.default) : 'none'}
			` : `background-color: ${props.theme.border.default};
		background-image: none;`)}

	padding: ${props => (props.hasCount ? '0 10px 0 6px' : '0')};
	display: flex;
	flex-direction: flex-row;
	transition: ${Transition.reaction.on};
	display: ${props => (props.hide ? 'none' : 'auto')};

	${props => props.dummy && css`
		height: 26px;
    padding: 0;
    justify-content: center;
	`}

	i { /* count */
		position: relative;
		transform: ${props => (props.hasCount ? 'translateX(0)' : 'translateX(-16px)')};
		opacity: ${props => (props.hasCount ? '1' : '0')};
		padding-left: 4px;
		line-height: 1.74;
		vertical-align: middle;
		font-style: normal;
		font-weight: 600;
	}

	div {
		position: relative;
		top: 1px;
		pointer-events: none;
	}

	svg, i {
		transform: ${props => (props.hasCount ? 'scale(1)' : 'scale(0)')};
		transition: ${Transition.reaction.off};
	}

	&:hover {
		max-width: 100px;
		max-height: 24px;
		border-radius: 24px;
		padding: 0 10px 0 6px;
		background: ${props => (props.active ? props.theme.warn.default : props.theme.text.alt)};
		background-image: ${props => (props.active ? Gradient(props.theme.warn.alt, props.theme.warn.default) : Gradient(props.theme.text.alt, props.theme.text.alt))}
		cursor: pointer;
		transform: ${props => (props.active ? 'translateY(-2px)' : 'none')};
		box-shadow: ${props => (props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none')};

		i {
			transform: translateX(0);
			opacity: 1;
		}

		svg, i {
			transform: scale(1);
			transition: ${Transition.hover.on};
		}
	}

	&:active {
		transform: scale(0.9);
		transition: ${Transition.hover.off};
	}
`;

export const Count = styled.i`
	font-weight: 600;
	color: #fff;
	font-size: 12px;
	display: inline-block;
`;
