// @flow
import React from 'react';
import Icon from 'src/components/icons';
import { LockedWrapper, LockedText } from '../style';

const LockedMessages = () => (
  <LockedWrapper>
    <Icon glyph={'private'} size={24} />
    <LockedText>This conversation has been locked</LockedText>
  </LockedWrapper>
);

export default LockedMessages;
