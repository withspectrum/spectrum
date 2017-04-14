import styled, { css } from 'styled-components';
import { Shadow, Transition } from '../Globals';

export const Wrapper = styled.div`
	display: inline-block;
	width: ${props => (props.nomargin ? 'calc(100% - 34px)' : 'calc(100% - 36px)')};
	margin: ${props => (props.nomargin ? '0' : '16px')};
	margin-bottom: 0;
	flex: 0 0 auto;
	border-radius: ${props => (props.nomargin ? '0' : '12px')};
	overflow: ${props => (props.overflow === 'visible' ? 'visible' : 'visible')};
	background-color: ${({ theme }) => theme.bg.default};
	transition: ${Transition.hover.off};
	-webkit-font-smoothing: subpixel-antialiased;
	box-shadow: ${Shadow.low};

	@media (max-width: 768px) {
		width: ${props => (props.nomargin ? '100%' : 'calc(100% - 16px)')};
		margin: ${props => (props.nomargin ? '0' : '8px')};
		margin-bottom: ${props => (props.nomargin ? '0' : '4px')};
		border-radius: ${props => (props.nomargin ? '0' : '12px')};

		&:first-of-type {
			margin-top: ${props => (props.nomargin ? '0' : '8px')};
		}
	}

	${props => !props.still && css`
		&:hover {
			box-shadow: ${Shadow.high};
			transition: ${Transition.hover.on};
			cursor: pointer;
		}
	`}
`;

export const LinkWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 0 0 auto;
	background-color: #ffffff;
	border-radius: 16px;
`;
