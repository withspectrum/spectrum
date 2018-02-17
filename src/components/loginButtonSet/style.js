// @flow
import styled from 'styled-components';
import { zIndex } from '../globals';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0;
`;

export const A = styled.a`
  display: flex;
`;

export const SigninButton = styled.div`
  display: flex;
  flex: 1;
  z-index: ${zIndex.card + 1};
  flex-direction: flex-row;
  align-self: flex-start;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.text.reverse};
  border-radius: 8px;
  padding: 8px;
  padding-right: 16px;
  font-size: 15px;
  font-weight: 600;
  position: relative;
  margin: 8px 0;
  width: 100%;
  margin-top: ${props => (props.showAfter ? '40px' : '8px')};

  ${props =>
    props.showAfter &&
    `
			&:after {
				content: 'Previously signed in with';
				position: absolute;
				top: -32px;
				font-size: 14px;
				font-weight: 600;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				text-align: center;
				color: ${props.theme.text.alt};
			}
		`} svg {
    fill: currentColor !important;
  }

  @media (max-width: 768px) {
    margin: 16px 0;

    ${props =>
      props.showAfter &&
      `
        margin: 48px 0 16px 0;
      `};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const Label = styled.span`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  margin-top: -1px;
  margin-left: 8px;
  line-height: 2.45;
  word-break: keep-all;
  white-space: nowrap;
  color: currentColor;
`;

export const TwitterButton = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.twitter.default : 'none'};
  color: ${props =>
    props.preferred ? '#fff' : props.theme.social.twitter.default};

  &:after {
    color: ${props => props.theme.social.twitter.default};
  }
`;

export const FacebookButton = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.facebook.default : 'none'};
  color: ${props =>
    props.preferred ? '#fff' : props.theme.social.facebook.default};

  &:after {
    color: ${props => props.theme.social.facebook.default};
  }
`;

export const GoogleButton = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.google.default : 'none'};
  color: ${props =>
    props.preferred ? '#fff' : props.theme.social.google.default};

  &:after {
    color: ${props => props.theme.social.google.default};
  }
`;

export const GithubButton = styled(SigninButton)`
  background: ${props => (props.preferred ? props.theme.text.default : 'none')};
  color: ${props => (props.preferred ? '#fff' : props.theme.text.default)};

  &:after {
    color: ${props => props.theme.text.default};
  }
`;
