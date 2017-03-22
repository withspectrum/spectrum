import styled, { css } from 'styled-components';
import { Shadow, H5 } from '../Globals';

export const Wrapper = styled.div`
	display: inline-block;
	width: calc(100% - 16px);
	margin: 8px 8px 0 8px;
	flex: 0 0 auto;
	border-radius: 4px;
	overflow: ${props => props.overflow === 'visible' ? 'visible' : 'hidden'};
	background-color: ${({ theme }) => theme.bg.default};
	transition: all 0.2s ease-in;
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

	${props => !props.static &&
css`
		&:hover {
			box-shadow: ${Shadow.high};
			transition: all 0.2s ease-out;
			cursor: pointer;
		}
	`}
`;

export const LinkWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 0 0 auto;
	background-color: #ffffff;
	transition: all 0.2s ease-in;
	box-shadow: inset -4px 0 0 ${props =>
  props.selected ? props.theme.brand.default : '#fff'};

	&:hover {
		box-shadow: inset -4px 0 0 ${props =>
  props.selected ? props.theme.brand.default : '#fff'};
		transition: all 0.2s ease-in-out;
	}
`;
