import styled from 'styled-components';
import { Logo } from '../shared/Logos';
import { Gradient, H2 } from '../shared/Globals';

export const Background = styled.div`
	background-color: ${({ theme }) => theme.space.dark};
	background-image: ${({ theme }) =>
  Gradient(theme.space.dark, theme.brand.alt)};
	width: 100%;
	max-height: 100%;
	overflow-y: hidden;
	display: flex;
	flex-direction: column;
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
	flex: 1 0 auto;
	flex-direction: flex-row;
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
		flex: 1 0 auto;
		margin-top: -1px;
		margin-left: 8px;
		line-height: 2.45;
		word-break: keep-all;
		white-space: nowrap;
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
	display: flex;
	flex-grow: 1;
	width: 100%;
	align-items: center;
	justify-content: center;
	padding: 2rem;

	@media (max-width: 768px) {
		margin-top: 320px;
		flex-direction: column;
	}
`;

export const Img = styled.img`
	min-height: 320px;
	max-height: 400px;
	margin-left: 40px;
	max-width: 25%;

	@media (max-width: 768px) {
		margin-left: 0;
		margin-top: 40px;
		max-width: 80%;
	}
`;
