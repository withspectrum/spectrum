// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { GoogleButton, Label, A } from './style';
import Icon from '../icons';

export const GoogleSigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler } = props;

  return (
    <A onClick={() => onClickHandler && onClickHandler('google')} href={href}>
      <GoogleButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'google'} />
        <Label>Sign in with Google</Label>
      </GoogleButton>
    </A>
  );
};
