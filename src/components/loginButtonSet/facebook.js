// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { FacebookButton, Label, A } from './style';
import Icon from '../icons';

export const FacebookSigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler } = props;

  return (
    <A onClick={() => onClickHandler && onClickHandler('facebook')} href={href}>
      <FacebookButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'facebook'} />
        <Label>Sign in with Facebook</Label>
      </FacebookButton>
    </A>
  );
};
