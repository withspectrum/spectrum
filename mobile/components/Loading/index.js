// @flow
import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { Container } from './style';
import theme from '../theme';

type Props = {
  size?: 'small' | 'large',
  color?: string,
};

class Loading extends React.Component<Props> {
  render() {
    const { size = 'small', color = theme.text.alt } = this.props;
    return (
      <Container>
        <ActivityIndicator size={size} color={color} />
      </Container>
    );
  }
}

export default Loading;
