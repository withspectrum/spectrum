import styled from 'styled-components';
import { Logo } from '../shared/Logos';
import {
  Gradient,
  H2,
  FlexCol,
  FlexRow,
  P,
  Transition,
  Shadow,
} from '../shared/Globals';

export const Wrapper = styled(FlexCol)`
	flex: 1 0 auto;
	width: 100%;
	background-color: ${({ theme }) => theme.bg.default};
`;

export const Section = styled(FlexCol)`
	position: relative;
	flex: 1 0 720px;
	justify-content: center;
	padding-bottom: 80px;

	@media (max-width: 768px) {
		flex-basis: 480px;
	}

	img {
		width: 320px;

		@media (max-width: 768px) {
			display: none;
		}
	}
`;

export const SectionOne = styled(Section)`
	background-color: ${({ theme }) => theme.space.dark};
	background-image: ${({ theme }) =>
  Gradient(theme.space.dark, theme.brand.alt)};
	color: ${({ theme }) => theme.text.reverse};

	img {
		margin-left: 40px;
		width: 240px;
	}

	@media (max-width: 768px) {
		flex-basis: 400px;
	}
`;

export const SectionTwo = styled(Section)`
	justify-content: space-between;
	height: 640px;
	background-color: ${({ theme }) => theme.bg.default};
	color: ${({ theme }) => theme.text.default};
	padding-bottom: 160px;

	img {
		margin-right: 80px;
		width: 360px;
	}
`;

export const SectionThree = styled(Section)`
	height: 640px;
	justify-content: space-around;
	background-color: ${({ theme }) => theme.space.dark};
	background-image: linear-gradient(to bottom, ${({ theme }) =>
  `${theme.space.dark}, ${theme.brand.default}`});
	color: ${({ theme }) => theme.text.reverse};

	img {
		margin-left: 80px;
	}
`;

export const SectionFour = styled(Section)`
	height: 480px;
	justify-content: space-around;
	background-color: ${({ theme }) => theme.bg.default};
	color: ${({ theme }) => theme.text.default};

	img {
		margin-right: 80px;
		width: 420px;
	}

	button {
		margin-top: 24px;
		color: ${({ theme }) => theme.brand.default};

		&:hover {
			box-shadow: 0 4px 16px rgba(56, 24, 229, 0.5);
		}
	}
`;

export const Footer = styled(Section)`
	flex-direction: row;
	flex: 0 0 80px;
	background-color: ${({ theme }) => theme.space.light};
	color: ${({ theme }) => theme.text.reverse};
	justify-content: space-between;
	align-items: center;
	padding: 0 40px;

	@media (max-width: 768px) {
		flex-basis: 240px;
		flex-direction: column;
		justify-content: flex-start;
		padding: 40px;
	}
`;

export const LinkBlock = styled.a`
	display: inline-block;
	margin: 0 24px;
	flex: 0 0 auto;
	position: relative;

	div {
		font-size: 16px;
		font-weight: 700;
		padding: 12px 16px;
		top: 4px;
		position: relative;
		text-align: center;
		transition: ${Transition.hover.off};
		border-radius: 4px;

		&:hover {
			border-radius: 12px;
			background-color: ${({ theme }) => theme.bg.default};
			color: #009EBA;
			transition: ${Transition.hover.on};
		}
	}

	@media (max-width: 768px) {
		flex-direction: column;
		justify-content: flex-start;
		padding-bottom: 24px;

		div {
			border-bottom: none;

			&:hover {
				border-bottom: none;
				padding-bottom: 0;
				text-decoration: underline;
			}
		}
	}
`;

export const Cluster = styled.img`
	position: absolute;
`;

export const ClusterOne = styled(Cluster)`
	max-width: 120px;
	max-height: 120px;
	opacity: 0.15;
	top: 10%;
	left: 10%;
	z-index: 1;
`;

export const ClusterTwo = styled(Cluster)`
	max-width: 160px;
	max-height: 160px;
	opacity: 0.15;
	top: 60%;
	right: 10%;
	z-index: 1;
`;

export const ClusterThree = styled(Cluster)`
	max-width: 80px;
	max-height: 80px;
	opacity: 0.15;
	top: 10%;
	right: 40%;
	z-index: 1;
`;

export const ClusterFour = styled(Cluster)`
	max-width: 80px;
	max-height: 80px;
	opacity: 0.15;
	top: 80%;
	left: 40%;
	z-index: 1;
`;

export const GoopyOne = styled.div`
	background-color: transparent;
	background: url(/img/goopy.svg) center bottom no-repeat;
	position: absolute;
	background-size: 100%;
	z-index: 0;
	height: calc(100% + 4px);
	width: 110%;
	top: 0;
	bottom: -2px;
	left: -5%;
	right: -5%;
`;

export const GoopyTwo = styled.div`
	background-color: transparent;
	background: url(/img/goopy-2.svg) center bottom no-repeat;
	position: absolute;
	background-size: 100%;
	transform: rotateY(180deg);
	z-index: 0;
	height: calc(100% + 2px);
	top: 0;
	width: 110%;
	bottom: -2px;
	left: -5%;
	right: -5%;
`;

export const GoopyThree = styled.div`
	background-color: transparent;
	background: url(/img/goopy-3.svg) center bottom no-repeat;
	position: absolute;
	background-size: 100%;
	z-index: 0;
	height: calc(100% + 2px);
	top: 0;
	width: 110%;
	bottom: -2px;
	left: -5%;
	right: -5%;
`;

export const GoopyFour = styled.div`
	background-color: transparent;
	background: url(/img/goopy-4.svg) center bottom no-repeat;
	position: absolute;
	background-size: 100%;
	z-index: 0;
	transform: rotateY(180deg);
	height: calc(100% + 2px);
	top: 0;
	width: 110%;
	bottom: -2px;
	left: -5%;
	right: -5%;
`;

export const Tagline = styled(H2)`
	font-weight: 700;
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
	border: 2px solid currentColor;
	border-radius: 8px;
	padding: 8px;
	padding-right: 16px;
	font-size: 14px;
	font-weight: 700;
	color: currentColor;

	span {
		display: inline-block;
		flex: 0 0 auto;
		margin-top: -1px;
		margin-left: 8px;
		line-height: 2.45;
		word-break: keep-all;
		white-space: nowrap;
		color: currentColor;
	}

	svg {
		fill: currentColor !important;
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
	padding: 0 10%;

	@media (max-width: 768px) {
		margin-top: 80px;
	}
`;

export const Copy = styled(P)`
	max-width: 400px;
	width: 100%;
	font-size: 18px;
	line-height: 24px;
	color: inherit;
	font-weight: 500;

	&:not(:first-of-type){
		margin-top: 24px;
	}
`;
