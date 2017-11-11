// @flow
import styled, { css } from 'styled-components';
import { Gradient, zIndex, Transition, Tooltip, monoStack } from '../globals';

const Bubble = styled.div`
  display: inline-block;
  border-radius: 16px;
  z-index: ${zIndex.card};

  vertical-align: middle;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;

  align-self: flex-start;

  box-shadow: ${props =>
    props.hashed
      ? `inset 0 0 0 2px ${props.theme.bg.default}, inset 0 0 0 4px ${props
          .theme.brand.default}`
      : ''};
  margin-top: 4px;
  margin-bottom: 4px;

  clear: both;

  &::selection {
    background-color: ${props => props.theme.brand.alt};
  }
`;

export const Indicator = styled.div`
  position: absolute;
  display: flex;
  flex: none;
  height: 8px;
  width: 8px;
  align-self: flex-end;
  border-radius: 8px;
  background-color: ${props => props.theme.bg.border};
  z-index: ${zIndex.card + 1};
  box-shadow: 0 0 0 2px ${props => props.theme.bg.default};
  margin-left: 4px;
`;

export const ActionWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  background-color: transparent;
  height: 24px;
  padding: 0 4px;
  margin-left: 4px;
  cursor: pointer;

  color: ${props => props.theme.text.placeholder};

  span {
    padding-left: 4px;
    font-size: 14px;
  }
`;

export const ModActionWrapper = styled(ActionWrapper)`
  padding: 0 8px;
  border-left: 2px solid ${props => props.theme.bg.wash};
`;

export const ReactionWrapper = styled(ActionWrapper)`
  ${props =>
    props.hasCount
      ? 'visibility: visible !important; opacity: 1 !important;'
      : ''};
  color: ${props =>
    props.hasReacted ? props.theme.warn.alt : props.theme.text.placeholder};

  &:hover {
    color: ${props =>
      props.hasReacted ? props.theme.warn.default : props.theme.text.alt};
  }

  & ~ ${Indicator} {
    ${props => (props.hasCount ? 'opacity: 0 !important' : '')};
    ${props => (props.hasCount ? 'visibility: hidden' : '')};
  }
`;

export const ActionUI = styled.div`
  display: flex;
  flex: none;
  position: absolute;
  left: 100%;
  bottom: 0;
  flex-direction: row;
  align-items: stretch;
  transition: ${Transition.hover.off};

  &:hover {
    transition: ${Transition.hover.on};

    ${ActionWrapper} {
      visibility: visible;
      opacity: 1;
      transition: ${Transition.hover.on};
    }

    ${Indicator} {
      transition: ${Transition.hover.on};
      visibility: hidden;
      opacity: 0;
      left: 100%;
    }
  }

  ${ActionWrapper} {
    transition: ${Transition.hover.off};
    visibility: hidden;
    opacity: 0;
  }

  ${Indicator} {
    transition: ${Transition.hover.off};
    visibility: visible;
    opacity: 1;
    left: 0;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  position: relative;
  transition: ${Transition.hover.off};

  ${props =>
    props.selected &&
    css`
      ${'' /* ${Bubble} {
        box-shadow: 0 0 0 2px ${props => props.theme.brand.alt},
          inset 0 0 0 2px ${props => props.theme.bg.default};
      } */} ${ActionUI} {
        transition: ${Transition.hover.on};

        ${ActionWrapper} {
          visibility: visible;
          opacity: 1;
          transition: ${Transition.hover.on};
        }

        ${Indicator} {
          transition: ${Transition.hover.on};
          visibility: hidden;
          opacity: 0;
          left: 100%;
        }
      }
    `} &:hover {
    ${ActionUI} {
      transition: ${Transition.hover.on};

      ${ActionWrapper} {
        visibility: visible;
        opacity: 1;
        transition: ${Transition.hover.on};
      }

      ${Indicator} {
        transition: ${Transition.hover.on};
        visibility: hidden;
        opacity: 0;
        left: 100%;
      }
    }
  }

  ${ActionWrapper} {
    transition: ${Transition.hover.off};
    visibility: hidden;
    opacity: 0;
  }

  ${Indicator} {
    transition: ${Transition.hover.off};
    visibility: visible;
    opacity: 1;
    left: 0;
  }
`;

export const Time = styled.div`
  font-size: 11px;
  color: ${props => props.theme.text.alt};
  position: absolute;
  left: calc(100% + 8px);
  top: 4px;
`;

export const Text = styled(Bubble)`
  font-size: 14px;
  line-height: 1.4;
  ${'' /* background-color: ${props =>
    props.me ? props.theme.brand.default : props.theme.generic.default}; */} ${'' /* background-image: ${props =>
    props.me
      ? Gradient(props.theme.brand.alt, props.theme.brand.default)
      : Gradient(props.theme.generic.alt, props.theme.generic.default)}; */} color: ${props =>
      props.theme.text.default};
  font-weight: 400;

  & + & {
    margin-top: 2px;
  }

  a {
    text-decoration: underline;
    word-break: break-word;
  }
`;

export const Emoji = styled(Bubble)`
  font-size: 48px;
  line-height: 1;
  vertical-align: middle;
  clear: both;
  display: block;
  margin-top: 12px;
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};

  &:last-of-type {
    margin-bottom: 0;
  }

  &:first-of-type:not(:last-of-type) {
    /* if two emojis are posted back to back, don't add margin to the first one */
    margin-bottom: 0;
  }

  & + & {
    margin: 0; /* if two emojis are next to each other, no margin needed */
  }

  & + img {
    margin-top: 8px; /* if emoji is followed by an image */
    margin-bottom: 8px;
  }

  & + p {
    margin-top: 8px; /* if emoji is followed by a bubble, add margin to the bubble */
  }
`;

export const Image = styled.img`
  display: block;
  clear: both;
  flex: 0 0 auto;
  vertical-align: middle;
  border-radius: 16px;
  max-width: 100%;
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  opacity: 1;
  transition: opacity 0.2s ease-out;
  border: 1px solid #f6f7f8;
  margin-top: ${props => (props.hashed ? '4px' : '0')};
  margin-bottom: ${props => (props.hashed ? '4px' : '0')};
  box-shadow: ${props =>
    props.hashed
      ? `0 0 0 2px ${props.theme.bg.default}, 0 0 0 4px ${props.theme.brand
          .default}`
      : ''};
`;

export const Code = styled(Bubble)`
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => props.theme.bg.reverse};
  color: ${props => props.theme.text.reverse};
  max-width: 100%;
  overflow-x: scroll;
  list-style: none;
`;

export const Line = styled.pre`
  display: inline-block;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  ${monoStack};
`;
