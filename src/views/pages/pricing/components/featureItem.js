// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import {
  Feature,
  FeatureIcon,
  FeatureContent,
  FeatureLabel,
  FeatureDescription,
  FeatureAction,
  FeatureButton,
  PriceLabel,
} from '../style';

type Props = {
  title: string,
  subtitle: string,
  buttonLabel?: string,
  icon?: string,
  color?: string,
  priceLabel?: string,
  render: Function,
};

type State = {
  isExpanded: boolean,
};

class FeatureItem extends React.Component<Props, State> {
  state = { isExpanded: false };

  toggleExpand = () => this.setState({ isExpanded: !this.state.isExpanded });

  render() {
    const {
      title,
      subtitle,
      icon = 'checkmark',
      color,
      priceLabel,
      buttonLabel = 'Learn more',
      render,
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <Feature>
        <FeatureIcon color={color}>
          <Icon glyph={icon} />
        </FeatureIcon>

        <FeatureContent>
          <FeatureLabel color={color}>
            {title}
            {priceLabel && <PriceLabel color={color}>{priceLabel}</PriceLabel>}
          </FeatureLabel>

          <FeatureDescription isExpanded={isExpanded}>
            {subtitle}
          </FeatureDescription>

          {isExpanded && render()}
        </FeatureContent>

        {!isExpanded && (
          <FeatureAction>
            <FeatureButton onClick={this.toggleExpand} color={color}>
              {buttonLabel}
            </FeatureButton>
          </FeatureAction>
        )}
      </Feature>
    );
  }
}

export default FeatureItem;
