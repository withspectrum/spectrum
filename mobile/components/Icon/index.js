// @flow
import * as React from 'react';
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
  color?: string,
  theme: Object,
};

// prettier-ignore
export default withTheme(({ size = 64, color = 'text.alt', glyph, theme, onPress }: Props) => {
    const colorPaths = color.split('.')
    const fill = theme[colorPaths[0]][colorPaths[1]]

    return (
      <ConditionalWrap
        condition={!!onPress}
        wrap={children => (
          <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
        )}
      >
        <Svg width={size} height={size} viewBox={`0 0 32 32`}>
          <G>
            {getPaths(glyph, fill)}
          </G>
        </Svg>
      </ConditionalWrap>
    );
  }
);
