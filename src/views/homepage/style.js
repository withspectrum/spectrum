import styled from 'styled-components';
import { Logo } from '../../components/logo';
import {
  Gradient,
  H2,
  FlexCol,
  FlexRow,
  P,
  Transition,
  Shadow,
  zIndex,
} from '../../components/globals';

export const Wrapper = styled(FlexCol)`
	flex: 1 0 auto;
	width: 100%;
	background-color: ${({ theme }) => theme.bg.default};
  overflow: auto;
	overflow-x: hidden;
`;

export const Section = styled(FlexCol)`
	position: relative;
	flex: auto;
	justify-content: center;
	padding-bottom: 80px;

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
		flex-basis: auto;
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
      color: #009eba;
      transition: ${Transition.hover.on};
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 16px;

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

export const Cluster = styled.img`position: absolute;`;

export const ClusterOne = styled(Cluster)`
	max-width: 120px;
	max-height: 120px;
	opacity: 0.15;
	top: 10%;
	left: 10%;
	z-index: ${zIndex.base};
`;

export const ClusterTwo = styled(Cluster)`
	max-width: 160px;
	max-height: 160px;
	opacity: 0.15;
	top: 60%;
	right: 10%;
	z-index: ${zIndex.base};
`;

export const ClusterThree = styled(Cluster)`
	max-width: 80px;
	max-height: 80px;
	opacity: 0.15;
	top: 10%;
	right: 40%;
	z-index: ${zIndex.base};
`;

export const ClusterFour = styled(Cluster)`
	max-width: 80px;
	max-height: 80px;
	opacity: 0.15;
	top: 80%;
	left: 40%;
	z-index: ${zIndex.base};
`;

export const GoopyOne = styled.div`
  background-color: transparent;
  background: url(/img/goopy.svg) center bottom no-repeat;
  position: absolute;
  background-size: 100%;
  z-index: ${zIndex.background};
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
  z-index: ${zIndex.background};
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
  z-index: ${zIndex.background};
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
  z-index: ${zIndex.background};
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

export const Button = styled.a`
  display: flex;
  flex-shrink: 1;
  z-index: ${zIndex.base + 1};
  flex-direction: flex-row;
  align-self: flex-start;
  align-items: center;
  color: ${({ theme }) => theme.text.reverse};
  border-radius: 8px;
  padding: 8px;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 700;
  transition: ${Transition.hover.off};
  position: relative;
  margin: 16px 0;

  ${props =>
    props.after &&
    `
			margin: 24px 0;

			&:after {
				content: 'Previously signed in with';
				position: absolute;
				top: -23px;
				font-size: 10px;
				font-weight: 500;
				text-transform: uppercase;
				opacity: 0.8;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				text-align: center;
				color: #fff;
			}
		`} span {
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

  &:hover {
    cursor: pointer;
  }
`;

export const ButtonTwitter = styled(Button)`
	background: ${props =>
    props.preferred ? props.theme.social.twitter.default : 'none'};
	color: ${props =>
    props.whitebg
      ? props.theme.social.twitter.default
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};

	&:hover {
		color: ${props =>
      props.whitebg ? props.theme.social.twitter.default : '#fff'}
	}
`;

export const ButtonFacebook = styled(Button)`
	background: ${props =>
    props.preferred ? props.theme.social.facebook.default : 'none'};
	color: ${props =>
    props.whitebg
      ? props.theme.social.facebook.default
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};


	&:hover {
		color: ${props =>
      props.whitebg ? props.theme.social.facebook.default : '#fff'}
	}
`;

export const ButtonGoogle = styled(Button)`
	background: ${props =>
    props.preferred ? props.theme.social.google.default : 'none'};
	color: ${props =>
    props.whitebg
      ? props.theme.social.google.default
      : props.preferred ? '#fff' : 'rgba(255,255,255,0.8)'};

	&:hover {
		color: ${props =>
      props.whitebg ? props.theme.social.google.default : '#fff'}
	}
`;

export const LinkButton = styled(Button)`
  margin-top: 24px;
  color: ${({ theme }) => theme.brand.default};
  background: ${({ theme }) => theme.bg.default};

  &:hover {
    box-shadow: ${Shadow.high} ${({ theme }) => theme.space.soft};
  }
`;

export const LogoWhite = styled(Logo)`
	max-width: 360px;
`;

export const LogoContainer = styled.div`max-width: 360px;`;

export const SectionContent = styled(FlexRow)`
	flex-grow: 1;
	width: 100%;
	align-items: center;
	justify-content: center;
	position: relative;
	z-index: ${zIndex.base + 1};
	padding: 0 40px;

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

export const LoginCard = styled.div`
  border-radius: 12px;
  padding: 16px 0;
  margin-top: 16px;
  align-self: flex-start;
  align-items: flex-start;
`;

export const Bullets = styled(FlexCol)`
  align-self: stretch;
  flex: 0 0 100%;
  align-items: center;
`;

export const Bullet = styled(FlexCol)`
  display: inline-block;
  width: 60%;
  max-width: 480px;
  margin-top: 48px;

  &:first-of-type {
    margin-top: 16px;
    margin-left: 16px;
    align-self: flex-start;
  }

  &:last-of-type {
    margin-left: 16px;
    align-self: flex-end;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BulletHeading = styled(FlexRow)`
  align-items: center;
  white-space: nowrap;
  position: relative;
  left: -40px;
`;

export const BulletTitle = styled.h2`
  margin-left: 8px;
  font-size: 18px;
  font-weight: 700;
`;

export const BulletCopy = styled.p`margin-top: 8px;`;
