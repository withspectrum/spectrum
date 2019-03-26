// @flow
import styled, { css } from 'styled-components';
import theme from 'shared/theme';
import { tint } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const StyledSegmentedControl = styled.div`
  display: flex;
  width: 100%;
  box-shadow: inset 0 -1px ${theme.bg.border};
  background: ${theme.bg.default};
  overflow: hidden;
  overflow-x: scroll;
  position: ${props => (props.sticky ? 'sticky' : 'relative')};
  z-index: ${props => (props.sticky ? '13' : '1')};

  ${props =>
    props.sticky &&
    css`
      top: ${props => (props.stickyOffset ? `${props.stickyOffset}px` : '0')};
    `};

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent; /* make scrollbar transparent */
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    max-width: 100vw;
    position: ${props => (props.mobileSticky ? 'sticky' : 'relative')};
    top: ${props =>
      props.mobileStickyOffset ? `${props.mobileStickyOffset}px` : '0'};
  }
`;

export const StyledSegment = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  flex: 1 0 auto;
  font-weight: 600;
  color: ${props => (props.isActive ? theme.text.default : theme.text.alt)};
  box-shadow: ${props =>
    props.isActive ? `inset 0 -2px 0 ${theme.text.default}` : 'none'};
  text-align: center;

  &:hover {
    background: ${theme.bg.wash};
    box-shadow: ${props =>
      props.isActive
        ? `inset 0 -2px 0 ${theme.text.default}`
        : `inset 0 -2px 0 ${tint(theme.bg.wash, -16)}`};
    color: ${props =>
      props.isActive ? theme.text.default : theme.text.secondary};
    cursor: pointer;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    &:hover {
      background: ${theme.bg.default};
    }

    &:active {
      background: ${theme.bg.wash};
    }
  }

  @media (min-width: ${MEDIA_BREAK}px) {
    ${props =>
      props.hideOnDesktop &&
      css`
        display: none;
      `}
  }
`;
