// @flow
import styled, { css } from 'styled-components';
import { Shadow, hexa, tint, Tooltip } from 'src/components/globals';
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

const getFontWeight = (size: Size) => {
  switch (size) {
    case 'small':
      return '500';
    case 'default':
      return '600';
    default: {
      return '600';
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
  font-weight: ${props => getFontWeight(props.size)};
  white-space: nowrap;
  word-break: keep-all;
  cursor: pointer;
  line-height: 1;
  position: relative;
  text-align: center;
  padding: ${props => getPadding(props.size)};
  opacity: ${props => (props.disabled ? '0.64' : '1')};
  box-shadow: ${props =>
    props.disabled ? 'none' : `0 1px 2px rgba(0,0,0,0.04)`};
  transition: box-shadow 0.2s ease-in-out;
  width: ${props => (props.fill ? '100%' : 'auto')};

  ${Tooltip};

  .icon {
    margin-right: 8px;
  }

  &:hover {
    transition: box-shadow 0.2s ease-in-out;
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

export const StyledPrimaryTextButton = styled.button`
  ${base};
  border: none;
  color: ${props => props.theme.brand.alt};
  box-shadow: none;
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${props => props.theme.brand.default};
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.text.alt, 0.32)};
  }
`;

export const StyledDangerButton = styled.button`
  ${base};
  border: 1px solid ${props => props.theme.bg.border};
  color: ${props => props.theme.warn.default};
  background-color: ${props => props.theme.bg.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.bg.default}, ${
      props.theme.bg.wash
    })`};

  &:hover {
    border: 1px solid ${props => props.theme.warn.default};
    color: ${props => props.theme.text.reverse};
    background-image: ${props =>
      `linear-gradient(to bottom, ${tint(props.theme.warn.alt, 4)}, ${tint(
        props.theme.warn.default,
        4
      )})`};
    box-shadow: ${props =>
      props.disabled ? 'none' : `${Shadow.mid} rgba(0,0,0,0.12)`};
  }

  &:active {
    border: 1px solid ${props => props.theme.warn.default};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.warn.alt}, ${
        props.theme.warn.default
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.warn.alt, 0.32)};
  }
`;

export const StyledTextButton = styled.button`
  ${base};
  border: none;
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

export const StyledLightTextButton = styled.button`
  ${base};
  border: none;
  color: ${props => props.theme.text.reverse};
  box-shadow: none;
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${props => props.theme.text.reverse};
    box-shadow: none;
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.bg.default, 0.16)};
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

export const StyledLightOutlineButton = styled.button`
  ${base}
  border: 1px solid ${props => props.theme.text.reverse};
  color: ${props => props.theme.text.reverse};
  background-color: transparent;
  background-image: none;

  &:hover {
    color: ${props => props.theme.text.reverse};
    border: 1px solid ${props => props.theme.text.reverse};
    box-shadow: none;
  }

  &:active {
    border: 1px solid ${props => props.theme.text.reverse};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default}, 
    0 0 0 3px ${props => hexa(props.theme.bg.default, 0.16)};
  }
`;

export const StyledIconButton = styled.button`
  ${base};
  border: none;
  color: ${props =>
    console.log(props) && props.iconColor
      ? props.iconColor(props.theme)
      : props.theme.text.secondary};
  background-color: transparent;
  background-image: none;
  box-shadow: none;
  padding: 0;

  .icon {
    margin-right: 0;
  }

  &:hover {
    color: ${props =>
      props.iconHoverColor
        ? props.iconHoverColor(props.theme)
        : props.theme.text.default};
    box-shadow: none;
  }

  &:active {
    transform: scale(0.96);
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
`;

export const StyledFacebookButton = styled(StyledPrimaryButton)`
  border: 1px solid ${props => props.theme.social.facebook.default};
  color: ${props => props.theme.text.reverse};
  background-color: ${props => props.theme.social.facebook.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.social.facebook.alt}, ${
      props.theme.social.facebook.default
    })`};

  &:active {
    border: 1px solid ${props => props.theme.social.facebook.default};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.social.facebook.alt}, ${
        props.theme.social.facebook.default
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.social.facebook.alt, 0.16)};
  }
`;

export const StyledTwitterButton = styled(StyledPrimaryButton)`
  border: 1px solid ${props => props.theme.social.twitter.default};
  color: ${props => props.theme.text.reverse};
  background-color: ${props => props.theme.social.twitter.default};
  background-image: ${props =>
    `linear-gradient(to bottom, ${props.theme.social.twitter.alt}, ${
      props.theme.social.twitter.default
    })`};

  &:active {
    border: 1px solid ${props => props.theme.social.twitter.default};
    background-image: ${props =>
      `linear-gradient(to top, ${props.theme.social.twitter.alt}, ${
        props.theme.social.twitter.default
      })`};
  }

  &:focus {
    box-shadow: 0 0 0 1px ${props => props.theme.bg.default},
      0 0 0 3px ${props => hexa(props.theme.social.twitter.alt, 0.16)};
  }
`;
