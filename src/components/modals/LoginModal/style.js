// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Transition } from '../../../components/globals';

export const SignInButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px;

  button {
    align-self: stretch;
    justify-content: center;
  }

  button + button {
    margin-top: 16px;
  }
`;

export const Description = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  padding: 8px 24px 16px;
  line-height: 1.4;
`;

export const Button = styled.a`
  display: flex;
  flex-shrink: 1;
  z-index: 2;
  flex-direction: flex-row;
  align-self: stretch;
  align-items: center;
  color: ${({ theme }) => theme.text.reverse};
  border-radius: 8px;
  padding: 8px;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 700;
  transition: ${Transition.hover.off};
  position: relative;
  width: 100%;
  justify-content: center;
  margin: 8px 0;

  ${props =>
    props.after &&
    `
      margin: 16px 0 8px;

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
