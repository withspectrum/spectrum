// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { GithubButton, Label, A } from './style';
import Icon from '../icons';

export const GithubSigninButton = (props: ButtonProps) => {
  const {
    verb = 'Sign in',
    href,
    preferred,
    showAfter,
    onClickHandler,
  } = props;

  return (
    <A onClick={() => onClickHandler && onClickHandler('github')} href={href}>
      <GithubButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'github'} />
        <Label>{verb} with Github</Label>
      </GithubButton>
    </A>
  );
};
