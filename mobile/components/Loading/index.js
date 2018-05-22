// @flow
import * as React from 'react';
import { withTheme } from 'styled-components';
import { ActivityIndicator } from 'react-native';
import { Container } from './style';

type Props = {
  size?: 'small' | 'large',
  color?: string,
  theme: Object,
};

class Loading extends React.Component<Props> {
  render() {
    const { size = 'small', color = this.props.theme.text.alt } = this.props;
    return (
      <Container>
        <ActivityIndicator size={size} color={color} />
      </Container>
    );
  }
}

export default withTheme(Loading);
