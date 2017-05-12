// @flow
/* eslint no-eval: 0 */
// $FlowFixMe
import styled, { css } from 'styled-components';
import { Gradient, Shadow, Transition, hexa } from '../globals';

// impacts every button
const baseStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  white-space: nowrap;
  word-break: keep-all;
  transition: ${Transition.hover.off};
  cursor: pointer;
  line-height: 1;
  position: relative;
  opacity: ${props => (props.disabled ? '0.4' : '1')};
  transition: all 0.2s ease-in-out;

  &:hover {
    transition: all 0.2s ease-in-out;
  }

  ${props => (props.size === 'small' ? `
        font-size: 12px;
        padding: 8px 12px;
      ` : props.size === 'large' ? `
        font-size: 16px;
        padding: 16px 24px;
      ` : `
        font-size: 14px;
        padding: 12px 16px;
      `)}

  ${props => (props.icon && !props.label ? 'padding: 0; span { display: none;}' : '')}
  /* if an icon is present in the icon, add separation from the label */
  div + span {
    margin-left: 8px;
  }
`;

// impacts only solid buttons
const buttonStyles = css`
  background-color: ${props => (props.color ? eval(`props.theme.${props.color}.default`) : props.theme.brand.default)};
  background-image: ${props => (props.color ? Gradient(eval(`props.theme.${props.color}.alt`), eval(`props.theme.${props.color}.default`)) : Gradient(props.theme.brand.alt, props.theme.brand.default))};
  color: ${props => props.theme.text.reverse};

  &:hover {'
    border-radius: ${props => (props.disabled ? '8px' : '12px')};
    transition: ${props => (props.disabled ? 'none' : Transition.hover.on)};
    box-shadow: ${props => (props.disabled ? 'none' : `${Shadow.high} ${hexa(props.theme.text.placeholder, 0.25)}`)};
  }

  &:active {
    box-shadow: ${props => `${Shadow.low} ${props.theme.text.placeholder}`};
  }
`;

export const StyledButton = styled.button`
  ${baseStyles}
  ${buttonStyles}
`;

export const OutlineStyledButton = styled.button`
  ${baseStyles}
  background: transparent;
  background-image: none;
  box-shadow: inset 0 0 0 2px ${props => eval(`props.theme.${props.color ? props.color : 'brand.default'}`)};
  color: ${props => eval(`props.theme.${props.color ? props.color : 'brand.default'}`)};

  &:hover {
    border-radius: 12px;
    color: ${props => eval(`props.theme.${props.hoverColor ? props.hoverColor : 'brand.default'}`)};
    box-shadow: inset 0 0 0 2px ${props => eval(`props.theme.${props.hoverColor ? props.hoverColor : 'brand.default'}`)};
  }
`;

export const LinkStyledButton = styled.button`
  ${baseStyles}
  background: transparent;
  background-image: none;
  box-shadow: none;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  transition: ${Transition.hover.off};

  &:hover {'
    color: ${props => eval(`props.theme.${props.hoverColor ? props.hoverColor : 'brand.default'}`)};
    box-shadow: ${Shadow.mid} ${props => hexa(props.theme.text.alt, 0.25)};
    transition: ${Transition.hover.on};
  }
`;

export const Label = styled.span`
  display: inline-block;
  line-height: inherit;
  ${props => (props.loading && !props.hasIcon ? 'opacity: 0;' : 'opacity: 1;')};
  transition: all 0.2s ease-in-out;
`;
