// @flow
import React from 'react';
import Icon from '../icons';
import { ReputationIcon, ReputationIconMini, Circle } from './style';

export default ({ color }) => (
  <ReputationIcon color={color}>
    <Icon glyph="rep" size="24" />
  </ReputationIcon>
);

export const ReputationMini = ({ color }) => (
  <ReputationIconMini color={color}>
    <Icon glyph="rep" size="20" />
  </ReputationIconMini>
);
