import styled from 'styled-components';
import { Logo } from '../shared/Icons';
import { Gradient, H2 } from '../shared/Globals';

export const Background = styled.div`
	position: relative;
	background-color: ${({ theme }) => theme.space.dark};
	background-image: ${({ theme }) =>
  Gradient(theme.space.dark, theme.space.light)};
	width: 100%;
	height: 100%;
	background-size: cover;
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	&:after {
		content: "";
		background: url('/img/starfield.png');
		opacity: 0.85;
		width: 100%;
		height: 100%;
		background-size: cover;
		position: absolute;
		z-index: 0;
	} 
`;

export const Tagline = styled(H2)`
	color: ${({ theme }) => theme.text.reverse};
	font-weight: 500;
	font-size: 20px;
	margin: 16px 0 40px 0;
`;

export const Button = styled.button`
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.bg.default};
	border: 2px solid transparent;
	border-radius: 8px;
	padding: 8px;
	padding-right: 16px;
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.brand.default};

	span {
		display: inline-block;
		margin-top: -1px;
		margin-left: 8px;
		color: ${({ theme }) => theme.brand.default};
	}

	transition: all 0.3s ease-out;

	&:hover {
		border-radius: 16px;
		background-color: transparent;
		border: 2px solid ${({ theme }) => theme.bg.default};
		transition: all 0.2s ease-in;
		cursor: pointer;

		span {
			color: ${({ theme }) => theme.text.reverse};
		}

		svg {
			fill: ${({ theme }) => theme.bg.default} !important;
		}
	}
`;

export const LogoWhite = styled(Logo)`
	height: 62px;
	width: 389px;
`;

export const ContentWrapper = styled.div`
	margin-left: 15vw;
	margin-top: 40vh;
	position: relative;
	z-index: 1;
`;
