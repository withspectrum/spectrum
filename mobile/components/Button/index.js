// @flow
import React from 'react';
import TouchableHighlight from '../TouchableHighlight';
import ConditionalWrap from '../ConditionalWrap';
import Loading from '../Loading';
import Icon from '../Icon';
import type { GlyphTypes } from '../icon/types';
import type { Node } from 'react';

import styled, { css, withTheme } from 'styled-components/native';

const ButtonView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 12px 16px;
  background-color: ${props =>
    props.color ? props.color(props) : props.theme.brand.alt};

  ${props =>
    props.state === 'disabled' &&
    css`
      background-color: ${props.theme.bg.inactive};
    `};

  ${props =>
    props.size === 'large' &&
    css`
      padding: 16px 32px;
    `};
`;

const ButtonText = styled.Text`
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: ${props => props.theme.text.reverse};

  ${props =>
    props.size === 'large' &&
    css`
      font-size: 18px;
      line-height: 18px;
    `};
`;

type Props = {
  onPress: () => any,
  children: Node,
  state?: 'disabled' | 'loading',
  color?: (props: Object) => string,
  size?: 'large',
  theme: Object,
  // TODO(@mxstbr): Handle icons
  icon?: GlyphTypes,
};

export const Button = withTheme((props: Props) => {
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
});
