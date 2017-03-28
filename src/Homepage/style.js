import styled from 'styled-components';
import { Logo } from '../shared/Logos';
import { Gradient, H2, FlexCol, FlexRow, P } from '../shared/Globals';

export const Wrapper = styled(FlexCol)`
	flex: 1 0 auto;
	width: 100%;
	background-color: ${({ theme }) => theme.bg.default};
`;

export const Section = styled(FlexCol)`
	position: relative;
	flex: 1 0 640px;
	justify-content: center;
	padding-bottom: 80px;
`;

export const SectionOne = styled(Section)`
	background-color: ${({ theme }) => theme.space.dark};
	background-image: ${({ theme }) =>
  Gradient(theme.space.dark, theme.brand.alt)};
	color: ${({ theme }) => theme.text.reverse};
`;

export const SectionTwo = styled(Section)`
	justify-content: space-between;
	height: 640px;
	background-color: ${({ theme }) => theme.bg.default};
	color: ${({ theme }) => theme.text.default};
	padding-bottom: 160px;
`;

export const SectionThree = styled(Section)`
	height: 640px;
	justify-content: space-around;
	background-color: ${({ theme }) => theme.space.dark};
	color: ${({ theme }) => theme.text.reverse};

	> p {
		font-weight: 500;
	}
`;

export const SectionFour = styled(Section)`
	height: 480px;
	justify-content: space-around;
	background-color: ${({ theme }) => theme.space.light};
	color: ${({ theme }) => theme.space.dark};

	> p {
		font-weight: 600;
	}
`;

export const GoopyOne = styled.div`
	background-color: transparent;
	background: url(/img/goopy.svg) center bottom no-repeat;
	position: absolute;
	background-size: contain;
	z-index: 0;
	height: 320px;
	width: 110%;
	bottom: -2px;
	left: -5%;
	right: -5%;
`;

export const GoopyTwo = styled(GoopyOne)`
	background: url(/img/goopy-2.svg) center bottom no-repeat;
`;

export const GoopyThree = styled(GoopyOne)`
	background: url(/img/goopy-3.svg) center bottom no-repeat;
`;

export const Tagline = styled(H2)`
	font-weight: 500;
	font-size: 24px;
	margin-top: 8px;
	margin-bottom: 24px;
	color: inherit;
`;

export const Button = styled.button`
	display: flex;
	flex: 0 0 auto;
	flex-direction: flex-row;
	align-self: flex-start;
	align-items: center;
	background: transparent;
	border: 2px solid ${({ theme }) => theme.bg.default};
	border-radius: 8px;
	padding: 8px;
	padding-right: 16px;
	font-size: 14px;
	font-weight: 700;
	color: inherit;

	span {
		display: inline-block;
		flex: 0 0 auto;
		margin-top: -1px;
		margin-left: 8px;
		line-height: 2.45;
		word-break: keep-all;
		white-space: nowrap;
		color: inherit;
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

export const SectionContent = styled(FlexRow)`
	flex-grow: 1;
	width: 100%;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: 2;

`;

export const Img = styled.img`
	min-height: 320px;
	max-height: 400px;
	margin-left: 40px;
	max-width: 25%;

	@media (max-width: 768px) {
		display: none;
	}
`;

export const Copy = styled(P)`
	max-width: 320px;
	width: 100%;
	font-size: 18px;
	line-height: 24px;
	color: inherit;

	&:not(:first-of-type){
		margin-top: 24px;
	}
`;
