// @flow
import React from 'react';
import { withTheme } from 'styled-components';
import TouchableHighlight from '../TouchableHighlight';
import ConditionalWrap from '../ConditionalWrap';
import Loading from '../Loading';
import Icon from '../Icon';
import { ButtonView, ButtonText } from './style';
import type { GlyphTypes } from '../icon/types';
import type { Node } from 'react';

type Props = {
  onPress: () => any,
  children: Node,
  state?: 'disabled' | 'loading',
  color?: (props: Object) => string,
  size?: 'large',
  theme: Object,
  icon?: GlyphTypes,
};

const UnwrappedButton = (props: Props) => {
  const { onPress, color, state, size, icon, theme } = props;

  const children =
    state === 'loading' ? (
      <Loading padding={0} color={theme.text.reverse} />
    ) : (
      props.children
    );
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
        <ConditionalWrap
          condition={typeof children === 'string'}
          wrap={children => (
            <ButtonText color={color} state={state} size={size}>
              {children}
            </ButtonText>
          )}
        >
          {children}
        </ConditionalWrap>
      </ButtonView>
    </TouchableHighlight>
  );
};

const Button = withTheme(UnwrappedButton);

export { Button };
