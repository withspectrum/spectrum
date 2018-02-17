// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { TwitterButton, Label, A } from './style';
import Icon from '../icons';

export const TwitterSigninButton = (props: ButtonProps) => {
  const {
    verb = 'Sign in',
    href,
    preferred,
    showAfter,
    onClickHandler,
  } = props;

  return (
    <A onClick={() => onClickHandler && onClickHandler('twitter')} href={href}>
      <TwitterButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'twitter'} />
        <Label>{verb} with Twitter</Label>
      </TwitterButton>
    </A>
  );
};
