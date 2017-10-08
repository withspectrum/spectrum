import React from 'react';
import Icon from '../icons';
import { ReputationIcon, ReputationIconMini } from './style';

export default ({ tipText }) => (
  <ReputationIcon>
    <Icon
      glyph="rep"
      size="24"
      tipText={tipText && tipText}
      tipLocation={'top-right'}
    />
  </ReputationIcon>
);

export const ReputationMini = ({ tipText }) => (
  <ReputationIconMini>
    <Icon
      glyph="rep"
      size="20"
      tipText={tipText && tipText}
      tipLocation={'top-right'}
    />
  </ReputationIconMini>
);

const customStyles = {
  height: '16px',
  position: 'relative',
  top: '-2px',
  marginRight: '0',
  marginLeft: '-3px',
};
export const ReputationMiniCommunity = ({ tipText, tipLocation }) => (
  <ReputationIconMini style={customStyles}>
    <Icon
      glyph="rep"
      size="20"
      tipText={tipText && tipText}
      tipLocation={tipLocation ? tipLocation : 'top-right'}
    />
  </ReputationIconMini>
);
