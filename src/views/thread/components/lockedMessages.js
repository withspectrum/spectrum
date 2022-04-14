// @flow
import React from 'react';
import { LockedWrapper } from '../style';

type Props = {
  children: React$Node,
};

const LockedMessages = ({ children }: Props) => (
  <LockedWrapper>{children}</LockedWrapper>
);

export default LockedMessages;
