// @flow
import * as React from 'react';
import { withTheme } from 'styled-components';
import { LayoutAnimation, Animated, Easing } from 'react-native';
import TouchableHighlight from '../TouchableHighlight';
import Loading from '../Loading';
import Icon from '../Icon';
import { ButtonView, ButtonText, ButtonIcon } from './style';
import type { GlyphTypes } from '../Icon/types';

const springAnimationProperties = {
  type: 'spring',
  springDamping: 0.7,
  property: 'opacity',
};

const animationConfig = {
  duration: 300,
  create: springAnimationProperties,
  update: springAnimationProperties,
  delete: springAnimationProperties,
};

type Props = {
  onPress: () => any,
  title: string,
  disabled: boolean,
  loading: boolean,
  size?: 'large',
  color?: (props: { ...Props, theme: Object }) => string,
  icon?: GlyphTypes,
  // NOTE: Passed in via withTheme, no need to pass manually
  theme: Object,
};

const ButtonContent = (props: Props) => {
  const {
    title,
    color,
    size,
    loading = false,
    disabled = false,
    icon,
    theme,
  } = props;

  if (loading) {
    return <Loading padding={0} color={theme.text.reverse} />;
  }

  return (
    <React.Fragment>
      {icon && (
        <ButtonIcon>
          <Icon
            glyph={icon}
            color={theme => theme.text.reverse}
            size={size === 'large' ? 32 : 24}
          />
        </ButtonIcon>
      )}
      <ButtonText
        color={color}
        loading={loading}
        disabled={disabled}
        size={size}
      >
        {title}
      </ButtonText>
    </React.Fragment>
  );
};

class UnwrappedButton extends React.Component<Props> {
  buttonScale = new Animated.Value(1);

  componentWillUpdate() {
    LayoutAnimation.configureNext(animationConfig);
  }

  onPressIn = () => {
    return Animated.spring(this.buttonScale, {
      toValue: 0.95,
      friction: 8,
      tension: 54,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  onPressOut = () => {
    return Animated.spring(this.buttonScale, {
      toValue: 1,
      friction: 8,
      tension: 54,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  render() {
    const { onPress, color, size, icon, disabled, loading } = this.props;

    return (
      <TouchableHighlight
        onPressIn={this.onPressIn}
        onPress={onPress}
        onPressOut={this.onPressOut}
        disabled={disabled}
      >
        <ButtonView
          icon={icon}
          color={color}
          disabled={disabled}
          loading={loading}
          size={size}
          style={{ transform: [{ scale: this.buttonScale }] }}
        >
          <ButtonContent {...this.props} />
        </ButtonView>
      </TouchableHighlight>
    );
  }
}

const Button = withTheme(UnwrappedButton);

export { Button };
