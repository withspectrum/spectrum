// @flow
import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { ActivityIndicator } from 'react-native';
import { Container } from './style';

type Props = {
  size?: 'small' | 'large',
  color?: string,
  padding?: number,
  theme: Object,
};

class Loading extends Component<Props> {
  render() {
    const {
      size = 'small',
      padding = 32,
      color = this.props.theme.text.alt,
    } = this.props;
    return (
      <Container padding={padding}>
        <ActivityIndicator size={size} color={color} />
      </Container>
    );
  }
}

export default withTheme(Loading);
