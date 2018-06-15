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

class LoadingSpinnerWithTheme extends React.Component<Props> {
  render() {
    const { size = 'small', color = this.props.theme.text.alt } = this.props;
    return <ActivityIndicator size={size} color={color} />;
  }
}

export const LoadingSpinner = withTheme(LoadingSpinnerWithTheme);

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

class LoadingSpinnerWrapped extends Component<Props> {
  render() {
    const { size = 'small', color = this.props.theme.text.alt } = this.props;
    return <ActivityIndicator size={size} color={color} />;
  }
}

export const LoadingSpinner = withTheme(LoadingSpinnerWrapped);
export default withTheme(Loading);
