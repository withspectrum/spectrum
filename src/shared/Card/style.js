import styled, { css } from 'styled-components';
import { Shadow, Transition } from '../Globals';

export const Wrapper = styled.div`
	display: inline-block;
	width: calc(100% - 32px);
	margin: 16px 8px 0 16px;
	flex: 0 0 auto;
	border-radius: 4px;
	overflow: ${props => props.overflow === 'visible' ? 'visible' : 'visible'};
	background-color: ${({ theme }) => theme.bg.default};
	transition: ${Transition.hover.off};
	-webkit-font-smoothing: subpixel-antialiased;
	box-shadow: ${Shadow.low};

	@media (max-width: 768px) {
		width: 100%;
		margin: 0;
		margin-bottom: 4px;
		border-radius: 0;

		&:first-of-type {
			margin-top: 8px;
		}
	}

	${props => !props.still &&
css`
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
	border-radius: 4px;
`;
