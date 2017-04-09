import styled, { css } from 'styled-components';
import { Shadow, Transition } from '../Globals';

export const Wrapper = styled.div`
	display: inline-block;
	width: calc(100% - 16px);
	margin: 8px;
	flex: 0 0 auto;
	border-radius: 16px;
	overflow: ${props => props.overflow === 'visible' ? 'visible' : 'visible'};
	background-color: ${({ theme }) => theme.bg.default};
	transition: ${Transition.hover.off};
	-webkit-font-smoothing: subpixel-antialiased;
	box-shadow: ${Shadow.low};

	@media (max-width: 768px) {
		width: calc(100% - 16px);
		margin: 8px;
		margin-bottom: 0;
		border-radius: 16px;
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
	border-radius: 16px;
`;
