// @flow
import React from 'react';
import Icon from 'src/components/icon';
import { Select, Container, IconContainer } from './style';

type Props = {
  children: React$Node,
  onChange: (evt: SyntheticInputEvent<HTMLSelectElement>) => void,
  defaultValue?: ?string,
};

export default (props: Props) => (
  <Container>
    <Select {...props} />
    <IconContainer>
      <Icon glyph={'down-caret'} size={20} />
    </IconContainer>
  </Container>
);
