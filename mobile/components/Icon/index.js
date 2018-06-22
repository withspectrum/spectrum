// @flow
import React from 'react';
import TouchableOpacity from '../TouchableOpacity';
import ConditionalWrap from '../ConditionalWrap';
import { Svg } from 'expo';
const { G } = Svg;
import { withTheme } from 'styled-components/native';
import getPaths from './glyphs';
import type { ThemeType } from '../theme';
import type { GlyphTypes } from './types';

type Props = {
  onPress?: Function,
  glyph: GlyphTypes,
  size?: number,
  color?: (theme: ThemeType) => string,
  style?: Object,
  theme: Object,
};

class Icon extends React.Component<Props> {
  render() {
    const { size = 64, color, glyph, theme, onPress, style } = this.props;
    const fill = color ? color(theme) : theme.text.alt;

    return (
      <ConditionalWrap
        condition={!!onPress}
        wrap={children => (
          <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
        )}
      >
        <Svg width={size} height={size} viewBox={`0 0 32 32`} style={style}>
          <G>{getPaths(glyph, fill)}</G>
        </Svg>
      </ConditionalWrap>
    );
  }
}

export default withTheme(Icon);
