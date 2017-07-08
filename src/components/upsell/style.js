// @flow
// $FlowFixMe
import styled from 'styled-components';
import { FlexRow, FlexCol, Gradient, Transition } from '../globals';

export const Title = styled.h1`
  color: ${props => props.theme.text.default};
  width: 100%;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.25;
  margin-bottom: 8px;
  padding: 0;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
`;

export const MiniTitle = styled(Title)`
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0 8px;
  }
`;

export const Subtitle = styled.h2`
  width: 100%;
  color: ${props => props.theme.text.default};
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.4;
  margin-bottom: 16px;
  padding: 0 24px;
  font-weight: 500;
  text-align: center;

  b {
    font-weight: 700;
  }

  a {
    color: ${props => props.theme.brand.default};
  }
`;

export const MiniSubtitle = styled(Subtitle)`
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  font-size: 0.875rem;
  line-height: 1.4;
`;

export const SmallTitle = styled(Title)`
  font-size: 18px;
`;

export const SmallSubtitle = styled(Subtitle)`
  font-size: 15px;
`;

export const Cost = styled(Subtitle)`
  margin-top: 8px;
  font-weight: bold;
`;

export const NullCol = styled(FlexCol)`
  background-image: ${props =>
    props.bg ? `url('/img/fills/${props.bg}.svg')` : 'none'};
  background-color: transparent;
  background-size: 110% auto;
  background-repeat: ${props => (props.repeat ? 'repeat-y' : 'no-repeat')};
  background-position: ${props =>
    props.repeat ? 'center top' : 'center center'};
  width: 100%;
  height: auto;
  min-height: 160px;
  flex: 0 0 auto;
  padding: ${props => (props.noPadding ? '0' : '2rem')};
  justify-content: center;
  align-items: center;
  position: relative;
  align-self: center;
`;

export const NullRow = styled(FlexRow)`
  background-image: url('/img/fills/${props =>
    props.bg ? `${props.bg}` : 'locked'}.svg');
  background-color: transparent;
  background-size: 110% auto;
  background-repeat: no-repeat;
  background-attachment: center;
  width: 100%;
  height: auto;
  padding: 1rem 15%;
`;

export const UpgradeError = styled.p`
  color: ${props => props.theme.warn.default};
  font-size: 14px;
  text-align: center;
  margin: 16px 0 0;
`;

export const Profile = styled.div`
  position: relative;
  padding: 16px 0;

  img {
    border-radius: 48px;
    width: 48px;
    height: 48px;
  }

  span {
    background-color: ${({ theme }) => theme.success.default};
    background-image: ${({ theme }) =>
      Gradient(theme.space.light, theme.success.default)};
    position: absolute;
    left: 75%;
    top: 48px;
    color: ${({ theme }) => theme.text.reverse};
    font-size: 10px;
    font-weight: 800;
    padding: 2px 4px;
    border-radius: 8px;
    line-height: 1.5;
    border: 2px solid #fff;
  }
`;

export const LargeEmoji = styled.div`
  display: flex;
  text-align: center;
  flex 1;
  padding: 16px 0 32px;
  font-size: 48px;
`;

export const SignInButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;

  button {
    margin-top: 8px;
  }

  button + button {
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled.a`
  display: flex;
  flex-shrink: 1;
  z-index: 2;
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
  margin: 8px;

  ${props =>
    props.after &&
    `
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
			}
		`} @media(max-width: 768px) {
    margin: 8px 0;
  }

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
  
  &:after {
    color: ${props => props.theme.social.twitter.default};
  }

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

  &:after {
    color: ${props => props.theme.social.facebook.default};
  }

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

  &:after {
    color: ${props => props.theme.social.google.default};
  }

	&:hover {
		color: ${props =>
      props.whitebg ? props.theme.social.google.default : '#fff'}
	}
`;
