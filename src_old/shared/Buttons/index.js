import React, { Component } from 'react';
import styled from 'styled-components';
import Icon from '../Icons';
import { Tooltip, Shadow, Gradient, Transition } from '../Globals';

// usage: icon="iconPath", label="string", color="palette.color", disabled, subtle, tooltip="tipLocation"

const buttonColor = props => {
  props.disabled ? props.theme.inactive : props.color;
};

const defaultColor = props => {
  props.subtle ? props.theme.warning.alt : props.theme.brand.default;
};

const iconOnly = props => {
  props.icon && props.tooltip ? true : false;
};

const SpectrumButton = styled.button`
  appearance: none;
  white-space: nowrap;
  word-break: keep-all;
  display: inline-block;
  background-color: ${props => (props.subtle || iconOnly(props) ? 'transparent' : buttonColor(props))};
  background-image: ${props => (props.subtle || props.disabled || iconOnly(props) ? 'none' : Gradient(props.theme.brand.alt, props.theme.brand.default))};
  border: 2px solid ${props => (props.subtle ? props.theme.bg.wash : 'transparent')};
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: ${props => (props.subtle ? '500' : '600')};
  color: ${props => (props.subtle ? buttonColor(props) : props.theme.text.reverse)};

  transition: ${Transition.hover.off};

  &:hover{
    cursor: pointer;
    color: ${props => (props.subtle ? props.theme.warn.alt : props.color)};
    ${props => (props.subtle ? `background-color: ${props.theme.bg.default};` : '')};
    transition: ${Transition.hover.on};
    box-shadow: ${props => (props.disabled || iconOnly(props) ? 'none' : Shadow.high)};
    border-radius: ${props => (props.disabled ? '8px' : '12px')};
		opacity: ${props => (props.disabled ? '0.5' : '1')};
    border-color: transparent;
  }

  > div > svg {
    fill: currentColor !important;
  }

  ${props => props.tooltip && Tooltip(props)};
`;

class Button extends Component {
  render() {
    return (
      <SpectrumButton
        icon={this.props.icon}
        label={this.props.label}
        color={this.props.color}
        disabled={this.props.disabled}
        subtle={this.props.subtle}
        tipLocation={this.props.tooltip}
        tipText={this.props.label && this.props.tooltip && this.props.label}
      >
        {this.props.icon && <Icon icon={this.props.icon} static />}
        {!this.props.tooltip && this.props.label ? this.props.label : ''}
      </SpectrumButton>
    );
  }
}

Button.PropTypes = {
  icon: React.PropTypes.string,
  label: React.PropTypes.string,
  color: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  subtle: React.PropTypes.bool,
  tooltip: React.PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  subtle: false,
  color: defaultColor(Button),
};

export default Button;
