// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
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
  fillColor?: Function,
  priceLabel?: string,
  hideIconsOnMobile?: boolean,
  render?: Function,
};

const Feature = (props: Props) => {
  const {
    title,
    subtitle,
    icon = 'checkmark',
    fillColor = theme => theme.success.alt,
    priceLabel,
    render,
  } = props;

  return (
    <FeatureWrapper fillColor={fillColor}>
      <Icon glyph={icon} size={32} />
      <FeatureTitle>{title}</FeatureTitle>
      {subtitle && <FeatureDescription>{subtitle}</FeatureDescription>}
      {priceLabel && (
        <FeaturePrice fillColor={fillColor}>{priceLabel}</FeaturePrice>
      )}
      {render && <FeatureRender>{render()}</FeatureRender>}
    </FeatureWrapper>
  );
};

export default Feature;
