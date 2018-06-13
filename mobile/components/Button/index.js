// @flow
import * as React from 'react';
import { withTheme } from 'styled-components';
import TouchableHighlight from '../TouchableHighlight';
import Loading from '../Loading';
import Icon from '../Icon';
import { ButtonView, ButtonText, ButtonIcon } from './style';
import type { GlyphTypes } from '../Icon/types';

type Props = {
  onPress: () => any,
  label: string,
  state?: 'disabled' | 'loading',
  size?: 'large',
  color?: (props: { ...Props, theme: Object }) => string,
  icon?: GlyphTypes,
  // NOTE: Passed in via withTheme, no need to pass manually
  theme: Object,
};

const ButtonContent = (props: Props) => {
  const { label, color, state, size, icon, theme } = props;

  if (state === 'loading')
    return <Loading padding={0} color={theme.text.reverse} />;

  return (
    <React.Fragment>
      {icon && (
        <ButtonIcon>
          <Icon
            glyph={icon}
            color={theme => theme.text.reverse}
            size={size === 'large' ? 32 : 24}
          />
        </ButtonIcon>
      )}
      <ButtonText color={color} state={state} size={size}>
        {label}
      </ButtonText>
    </React.Fragment>
  );
};

const UnwrappedButton = (props: Props) => {
  const { onPress, color, state, size, icon } = props;

  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={state === 'disabled' || state === 'loading'}
    >
      <ButtonView icon={icon} color={color} state={state} size={size}>
        <ButtonContent {...props} />
      </ButtonView>
    </TouchableHighlight>
  );
};

const Button = withTheme(UnwrappedButton);

export { Button };
