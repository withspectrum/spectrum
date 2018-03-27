// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import {
  FeatureWrapper,
  FeatureTitle,
  FeatureDescription,
  FeaturePrice,
  PriceLabel,
} from '../style';

type Props = {
  title: string,
  subtitle?: string,
  icon?: string,
  color?: string,
  priceLabel?: string,
  hideIconsOnMobile?: boolean,
};

const Feature = props => {
  const {
    title,
    subtitle,
    icon = 'checkmark',
    color = 'success',
    priceLabel,
  } = props;

  return (
    <FeatureWrapper color={color}>
      <Icon glyph={icon} size={32} />
      <FeatureTitle>{title}</FeatureTitle>
      {subtitle && <FeatureDescription>{subtitle}</FeatureDescription>}
      {priceLabel && <FeaturePrice color={color}>{priceLabel}</FeaturePrice>}
    </FeatureWrapper>
  );
};

export default Feature;
