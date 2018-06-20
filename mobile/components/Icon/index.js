// @flow
import React from 'react';
import TouchableOpacity from '../TouchableOpacity';
import ConditionalWrap from '../ConditionalWrap';
import { Svg } from 'expo';
const { G } = Svg;
import { withTheme } from 'styled-components/native';
import type { GlyphTypes } from './types';
import getPaths from './glyphs';

type Props = {
  onPress?: Function,
  glyph: GlyphTypes,
  size?: number,
  color?: (theme: Object) => string,
  style?: Object,
  theme: Object,
};

// prettier-ignore
export default withTheme(({ size = 64, color, glyph, theme, onPress, style }: Props) => {
    const fill = color ? color(theme) : theme.text.alt;

    return (
      <ConditionalWrap
        condition={!!onPress}
        wrap={children => (
          <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
        )}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style}>
          <G>
            {getPaths(glyph, fill)}
          </G>
        </Svg>
      </ConditionalWrap>
    );
  }
);
