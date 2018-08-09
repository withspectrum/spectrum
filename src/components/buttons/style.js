// @flow
import styled, { css } from 'styled-components';
import { Shadow, Transition, hexa, tint } from '../globals';
import type { Size } from './';

const getPadding = (size: Size) => {
  switch (size) {
    case 'small':
      return '2px 4px';
    case 'default':
      return '8px 16px';
    case 'large':
      return '12px 24px';
    default: {
      return '4px 8px';
    }
  }
};

const getFontSize = (size: Size) => {
  switch (size) {
    case 'small':
      return '12px';
    case 'default':
      return '14px';
    case 'large':
      return '16px';
    default: {
      return '16px';
    }
  }
};

const base = css`
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: ${props => getFontSize(props.size)};
  font-weight: 500;
  white-space: nowrap;
  word-break: keep-all;
  transition: ${Transition.hover.off};
  cursor: pointer;
  line-height: 1;
  position: relative;
  text-align: center;
  padding: ${props => getPadding(props.size)};
  opacity: ${props => (props.disabled ? '0.64' : '1')};
  box-shadow: ${props =>
    props.disabled ? 'none' : `0 1px 2px rgba(0,0,0,0.04)`};

  .icon {
    margin-right: 8px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &:hover {
    transition: ${Transition.hover.on};
    box-shadow: ${props =>
      props.disabled ? 'none' : `${Shadow.mid} rgba(0,0,0,0.08)`};
  }
`;

export const StyledButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.bg.border};
  color: ${props => props.theme.text.secondary};
  background-color: ${props => props.theme.bg.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.bg.default}, ${
      props.theme.bg.wash
    })`};
  
  &:hover {
    color: ${props => props.theme.text.default};
  }

  &:active {
    border: 1px solid ${props => props.theme.text.placeholder};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.bg.default}, ${
        props.theme.bg.wash
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props => props.theme.bg.border};
  }
`;

export const StyledPrimaryButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.brand.default};
  color: ${props => props.theme.text.reverse};
  background-color: ${props => props.theme.brand.alt};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.brand.alt}, ${
      props.theme.brand.default
    })`};
  text-shadow: 0 1px 1px rgba(0,0,0,0.08);

  &:hover {
    color: ${props => props.theme.text.reverse};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(props.theme.brand.alt, 16)}, ${tint(
        props.theme.brand.default,
        16
      )})`};
    box-shadow: ${props =>
      props.disabled ? 'none' : `${Shadow.mid} rgba(0,0,0,0.12)`};
  }

  &:active {
    border: 1px solid ${props => props.theme.brand.default};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.brand.alt}, ${
        props.theme.brand.default
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props =>
  hexa(props.theme.brand.alt, 0.16)};
  }
`;

export const StyledSecondaryButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.success.default};
  color: ${props => props.theme.text.reverse};
  background-color: ${props => props.theme.success.alt};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.success.alt}, ${
      props.theme.success.default
    })`};
  text-shadow: 0 1px 1px rgba(0,0,0,0.08);

  &:hover {
    color: ${props => props.theme.text.reverse};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(props.theme.success.alt, 4)}, ${tint(
        props.theme.success.default,
        4
      )})`};
    box-shadow: ${props =>
      props.disabled ? 'none' : `${Shadow.mid} rgba(0,0,0,0.12)`};
  }

  &:active {
    border: 1px solid ${props => props.theme.success.default};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.success.alt}, ${
        props.theme.success.default
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props =>
  hexa(props.theme.success.alt, 0.32)};
  }
`;

export const StyledTextButton = styled.button`
  ${base} border: none;
  color: ${props => props.theme.text.secondary};
  box-shadow: none;
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${props => props.theme.text.default};
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.text.alt, 0.32)};
  }
`;

export const StyledOutlineButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.bg.border};
  color: ${props => props.theme.text.secondary};
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${props => props.theme.text.default};
    border: 1px solid ${props => props.theme.text.alt};
    box-shadow: none;
  }

  &:active {
    border: 1px solid ${props => props.theme.text.placeholder};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props =>
      props.theme.bg.default}, 0 0 0 3px ${props => props.theme.bg.border};
  }
`;

export const StyledIconButton = styled.button`
  ${base};
  border: none;
  color: ${props => props.theme.text.secondary};
  background-color: transparent;
  background-image: none;
  box-shadow: none;
  padding: 0;

  .icon {
    margin-right: 0;
  }

  &:hover {
    color: ${props => props.theme.text.default};
    box-shadow: none;
  }

  &:active {
    transform: scale(0.96);
    transition: ${Transition.hover.on};
  }

  &:focus {
    box-shadow: none;
  }
`;

export const StyledButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button + button {
    margin-left: 8px;
  }
`;

export const StyledButtonSegmentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  button {
    z-index: 1;
  }

  button:active,
  button:focus {
    z-index: 2;
  }

  button:first-of-type:not(:last-of-type) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button:last-of-type:not(:first-of-type) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  button:not(:last-of-type):not(:first-of-type) {
    border-radius: 0;
    position: relative;
    margin: 0 -1px;
  }

  button:not(:last-of-type) {
    border-right: 2px solid ${props => hexa(props.theme.bg.default, 0.12)};
  }

  ${StyledPrimaryButton} {
    &:focus {
      box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
        0 0 0 3px ${props => hexa(props.theme.brand.alt, 0.16)};
    }
  }

  ${StyledSecondaryButton} {
    &:focus {
      box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
        0 0 0 3px ${props => hexa(props.theme.success.alt, 0.32)};
    }
  }
`;
