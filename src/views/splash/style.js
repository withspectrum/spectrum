import styled from 'styled-components';
import { Button } from '../../components/buttons';
import {
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

export const Flexer = styled(FlexRow)`
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Header = styled(FlexRow)`
  padding: 32px;
  justify-content: space-between;
  z-index: ${zIndex.card}
`;

export const Content = styled(FlexRow)`
	flex: auto;
	align-self: stretch;
	align-items: center;
	justify-content: center;
	position: relative;

	@media (max-width: 768px) {
    flex-direction: column;
	}
`;

export const Tagline = styled(H2)`
	font-weight: 900;
	font-size: 32px;
	margin-top: 8px;
	margin-bottom: 8px;
	color: inherit;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

export const Copy = styled(P)`
	max-width: 480px;
	width: 100%;
	font-size: 16px;
	line-height: 1.5;
	color: inherit;
	font-weight: 500;

	&:not(:first-of-type){
		margin-top: 16px;
	}

  @media (max-width: 768px) {
    text-align: left;
  }
`;

export const Bullets = styled(FlexRow)`
  align-self: stretch;
  flex: auto;
  justify-content: center;
  align-items: flex-start;
  margin: 32px 16px 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 0;
  }
`;

export const Bullet = styled(FlexCol)`
  display: inline-block;
  width: calc(33% - 64px);
  min-width: 320px;
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

export const BulletCopy = styled.p`
  margin-top: 8px;
  font-weight: 500;
`;

export const PrimaryCTA = styled(Button)`
  padding: 8px 12px;
  font-weight: 700;
  font-size: 16px;
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

  &:hover {
    text-decoration: none;
  }

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
      }
    }
  }
`;
