// @flow
import * as React from 'react';
import type { ButtonProps } from './';
import { GithubButton, Label, A } from './style';
import Icon from 'src/components/icon';

export const GithubSigninButton = (props: ButtonProps) => {
  const { href, preferred, showAfter, onClickHandler, githubOnly } = props;

  return (
    <A
      githubOnly={githubOnly}
      onClick={() => onClickHandler && onClickHandler('github')}
      href={href}
    >
      <GithubButton showAfter={showAfter} preferred={preferred}>
        <Icon glyph={'github'} />
        <Label>{githubOnly ? 'Sign up' : 'Log in'} with GitHub</Label>
      </GithubButton>
    </A>
  );
};
