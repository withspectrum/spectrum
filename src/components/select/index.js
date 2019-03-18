// @flow
import React from 'react';
import { StyledSelect, Select } from './style';

type Props = {
  children: React$Node,
  onChange: (evt: SyntheticInputEvent<HTMLSelectElement>) => void,
  defaultValue?: ?string,
  className?: string,
};

export default (props: Props) => (
  <StyledSelect className={props.className}>
    <Select {...props} />
  </StyledSelect>
);
