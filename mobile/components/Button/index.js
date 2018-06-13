// @flow
import React from 'react';
import { withTheme } from 'styled-components';
import TouchableHighlight from '../TouchableHighlight';
import ConditionalWrap from '../ConditionalWrap';
import Loading from '../Loading';
import Icon from '../Icon';
import { ButtonView, ButtonText } from './style';
import type { GlyphTypes } from '../Icon/types';
import type { Node } from 'react';

type Props = {
  onPress: () => any,
  title: string,
  state?: 'disabled' | 'loading',
  size?: 'large',
  color?: (props: { ...Props, theme: Object }) => string,
  icon?: GlyphTypes,
  // NOTE: Passed in via withTheme, no need to pass manually
  theme: Object,
};

const UnwrappedButton = (props: Props) => {
  const { onPress, title, color, state, size, icon, theme } = props;

  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={state === 'disabled' || state === 'loading'}
    >
      <ButtonView icon={icon} color={color} state={state} size={size}>
        {icon && (
          <Icon
            glyph={icon}
            color={theme => theme.text.reverse}
            size={size === 'large' ? 26 : 22}
          />
        )}
        {state === 'loading' ? (
          <Loading padding={0} color={theme.text.reverse} />
        ) : (
          <ButtonText color={color} state={state} size={size}>
            {title}
          </ButtonText>
        )}
      </ButtonView>
    </TouchableHighlight>
  );
};

const Button = withTheme(UnwrappedButton);

export { Button };
