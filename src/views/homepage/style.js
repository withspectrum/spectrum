import styled from 'styled-components';
import { Button } from '../../components/buttons';
import {
  Gradient,
  H2,
  FlexCol,
  FlexRow,
  P,
  Transition,
  Shadow,
  zIndex,
  hexa,
} from '../../components/globals';

export const Wrapper = styled(FlexCol)`
	flex: 1 0 auto;
	width: 100%;
	background-color: ${({ theme }) => theme.bg.default};
  overflow: auto;
	overflow-x: hidden;
  z-index: ${zIndex.base};
`;

export const Tagline = styled(H2)`
	font-weight: 700;
	font-size: 24px;
	margin-top: 8px;
	margin-bottom: 24px;
	color: inherit;
`;

export const Flexer = styled(FlexRow)`
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
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

export const Bullets = styled(FlexRow)`
  align-self: stretch;
  flex: auto;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Bullet = styled(FlexCol)`
  display: inline-block;
  width: calc(33% - 64px);
  min-width: 256px;
  max-width: 480px;
  margin: 32px;
  margin-bottom: 0;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    margin-top: 48px;
  }
`;

export const BulletHeading = styled(FlexRow)`
  align-items: center;
  white-space: nowrap;
  position: relative;
`;

export const BulletTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
`;

export const BulletCopy = styled.p`margin-top: 8px;`;

export const PrimaryCTA = styled(Button)`
  padding: 8px 12px;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  background-color: ${props => props.theme.bg.default};
  background-image: none;
  color: ${props => props.theme.brand.alt};
  transition: ${Transition.hover.off};
  z-index: ${zIndex.card};

  &:hover {
    background-color: ${props => props.theme.bg.default};
    color: ${props => props.theme.brand.default};
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
    transition: ${Transition.hover.on};
  }
`;

export const SecondaryCTA = styled(PrimaryCTA)`
  color: ${props => props.theme.text.reverse};
  background-color: transparent;
  border: 2px solid transparent;
  margin-left: 16px;

  &:hover {
    color: ${props => props.theme.text.reverse};
    background-color: transparent;
    border-color: ${props => props.theme.bg.default};
    box-shadow: none;
  }
`;

export const SignInButton = styled.a`
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

export const LoginCard = styled.div`
  border-radius: 12px;
  padding: 16px 0;
  margin-top: 16px;
  align-self: flex-start;
  align-items: flex-start;
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

export const Footer = styled(FlexRow)`
	position: relative;
	flex: auto;
  justify-content: space-between;
  padding: 24px 24px 24px 40px;
  background-color: ${({ theme }) => theme.bg.reverse};
	color: ${({ theme }) => theme.text.reverse};

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
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
    border-radius: 12px;

    &:hover {
      background-color: ${({ theme }) => theme.bg.default};
      color: ${({ theme }) => theme.text.default};
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

export const LinkButton = styled(Button)`
  margin-top: 24px;
  color: ${({ theme }) => theme.brand.default};
  background: ${({ theme }) => theme.bg.default};

  &:hover {
    box-shadow: ${Shadow.high} ${({ theme }) => theme.space.soft};
  }
`;
