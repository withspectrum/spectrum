// @flow
import React from 'react';
import { ReputationIcon, ReputationIconMini, Circle } from './style';

export default () => (
  <ReputationIcon>
    <Circle />
    <Circle />
  </ReputationIcon>
);

export const ReputationMini = () => (
  <ReputationIconMini>
    <Circle />
    <Circle />
  </ReputationIconMini>
);
