import React from 'react';
import { MediaLabel, MediaInput } from './style';
import Icon from 'src/components/icon';

export default ({
  onChange,
  accept = '.png, .jpg, .jpeg, .gif, .mp4',
  multiple = false,
  glyph = 'photo',
}) => (
  <MediaLabel>
    <MediaInput
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={onChange}
    />
    <Icon glyph={glyph} />
  </MediaLabel>
);
