// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { TwitterButton, Label, A } from './style';
import Icon from '../icons';

export const TwitterSigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler } = props;

  return (
    <A onClick={() => onClickHandler && onClickHandler('twitter')} href={href}>
      <TwitterButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'twitter'} />
        <Label>Sign in with Twitter</Label>
      </TwitterButton>
    </A>
  );
};
