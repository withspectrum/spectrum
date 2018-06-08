// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import {
  FeatureWrapper,
  FeatureTitle,
  FeatureDescription,
  FeaturePrice,
  FeatureRender,
} from '../style';

type Props = {
  title: string,
  subtitle?: string,
  icon?: string,
  color?: string,
  priceLabel?: string,
  hideIconsOnMobile?: boolean,
  render?: Function,
};

const Feature = (props: Props) => {
  const {
    title,
    subtitle,
    icon = 'checkmark',
    color = 'success',
    priceLabel,
    render,
  } = props;

  return (
    <FeatureWrapper color={color}>
      <Icon glyph={icon} size={32} />
      <FeatureTitle>{title}</FeatureTitle>
      {subtitle && <FeatureDescription>{subtitle}</FeatureDescription>}
      {priceLabel && <FeaturePrice color={color}>{priceLabel}</FeaturePrice>}
      {render && <FeatureRender>{render()}</FeatureRender>}
    </FeatureWrapper>
  );
};

export default Feature;
