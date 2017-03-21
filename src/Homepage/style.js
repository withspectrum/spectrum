import styled from 'styled-components';
import { Logo } from '../shared/Logos';
import { Gradient, H2 } from '../shared/Globals';

export const Background = styled.div`
	position: relative;
	background-color: ${({ theme }) => theme.space.dark};
	background-image: ${({ theme }) =>
  Gradient(theme.space.dark, theme.brand.alt)};
	width: 100%;
	height: 100%;
	background-size: cover;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

export const Tagline = styled(H2)`
	color: ${({ theme }) => theme.text.reverse};
	font-weight: 500;
	font-size: 20px;
	margin-top: 8px;
	margin-bottom: 24px;
`;

export const Button = styled.button`
	display: flex;
	align-items: center;
	background: transparent;
	border: 2px solid ${({ theme }) => theme.bg.default};
	border-radius: 8px;
	padding: 8px;
	padding-right: 16px;
	font-size: 14px;
	font-weight: 700;
	color: ${({ theme }) => theme.text.reverse};

	span {
		display: inline-block;
		margin-top: -1px;
		margin-left: 8px;
		line-height: 2.45;
		color: ${({ theme }) => theme.brand.reverse};
	}

	svg {
		fill: ${({ theme }) => theme.bg.default} !important;
	}

	transition: all 0.3s ease-out;

	&:hover {
		border-radius: 16px;
		border: 2px solid transparent;
		background-color: ${({ theme }) => theme.bg.default};
		transition: all 0.2s ease-in;
		cursor: pointer;

		span {
			color: ${({ theme }) => theme.brand.default};
		}

		svg {
			fill: ${({ theme }) => theme.brand.default} !important;
		}
	}
`;

export const LogoWhite = styled(Logo)`
	max-width: 360px;
`;

export const LogoContainer = styled.div`
	max-width: 360px;
`;

export const ContentWrapper = styled.div`
	box-sizing: border-box;
	display: flex;
	flex-grow: 1;
	width: 100%;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	position: relative;
	z-index: 1;
`;

export const Img = styled.img`
	height: 320px;
	margin-left: 40px;
	z-index: -1;

	@media (max-width: 540px) {
		position: absolute;
		margin-left: 0;
		bottom: -100px;
	}
`;
