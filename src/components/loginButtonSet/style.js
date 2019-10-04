// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';

export const Container = styled.div`
  display: grid;
  grid-gap: 16px;
  align-items: flex-end;
  padding: 16px 0;
  grid-template-columns: repeat(2, 1fr);
`;

export const A = styled.a`
  display: flex;
  grid-column: 1 / 2 span;
`;

export const SigninButton = styled.div`
  display: flex;
  flex: 1;
  z-index: ${zIndex.card + 1};
  flex-direction: flex-row;
  align-self: flex-start;
  align-items: center;
  justify-content: flex-start;
  color: ${theme.text.reverse};
  border-radius: 32px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 600;
  position: relative;
  width: 100%;
  cursor: pointer;
  ${props => props.showAfter && `margin-top: 32px`};

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
    color: ${theme.social.twitter.default};
  }
`;

export const FacebookButton = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.facebook.default : 'none'};
  color: ${props =>
    props.preferred ? '#fff' : props.theme.social.facebook.default};

  &:after {
    color: ${theme.social.facebook.default};
  }
`;

export const GoogleButton = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.google.default : 'none'};
  color: ${props =>
    props.preferred ? '#fff' : props.theme.social.google.default};

  &:after {
    color: ${theme.social.google.default};
  }
`;

export const GithubButton = styled(SigninButton)`
  background: ${props =>
    props.preferred ? props.theme.social.github.default : 'none'};
  color: ${props =>
    props.preferred ? '#fff' : props.theme.social.github.default};

  &:after {
    color: ${theme.text.default};
  }
`;
