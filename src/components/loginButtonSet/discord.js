// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { DiscordButton, Label, A } from './style';
import Icon from '../icons';

export const DiscordSigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler } = props;
  // TODO: create Discord glyph (https://discordapp.com/branding)
  return (
    <A onClick={() => onClickHandler && onClickHandler('discord')} href={href}>
      <DiscordButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'twitter'} />
        <Label>Sign in with Discord</Label>
      </DiscordButton>
    </A>
  );
};
