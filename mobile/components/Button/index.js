// @flow
import React from 'react';
import TouchableHighlight from '../TouchableHighlight';
import ConditionalWrap from '../ConditionalWrap';
import Loading from '../Loading';
import type { GlyphTypes } from '../icon/types';
import type { Node } from 'react';

import styled, { css, withTheme } from 'styled-components/native';

const ButtonView = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 12px 16px;
  background-color: ${props =>
    props.color ? props.color(props) : props.theme.brand.alt};

  // States
  ${props =>
    props.state === 'disabled' &&
    css`
      background-color: ${props.theme.bg.inactive};
    `};
`;

const ButtonText = styled.Text`
  font-weight: 600;
  font-size: 14px;
  line-height: 14px;
  color: ${props => props.theme.text.reverse};

  // Sizes
  ${props =>
    props.size === 'large' &&
    css`
      font-size: 18px;
      line-height: 18px;
      padding: 16px 32px;
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
  const { onPress, children, color, state, size, icon, theme } = props;

  const render =
    state === 'loading' ? (
      <Loading padding={0} color={theme.text.reverse} />
    ) : (
      children
    );
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={state === 'disabled' || state === 'loading'}
    >
      <ButtonView color={color} state={state} size={size}>
        <ConditionalWrap
          condition={typeof render === 'string'}
          wrap={children => (
            <ButtonText color={color} state={state} size={size}>
              {children}
            </ButtonText>
          )}
        >
          {render}
        </ConditionalWrap>
      </ButtonView>
    </TouchableHighlight>
  );
});
