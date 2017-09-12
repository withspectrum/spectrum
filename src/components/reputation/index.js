// @flow
import React from 'react';
import Icon from '../icons';
import { ReputationIcon, ReputationIconMini, Circle } from './style';

export default ({ tipText }) =>
  console.log('tipText', tipText) || (
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
