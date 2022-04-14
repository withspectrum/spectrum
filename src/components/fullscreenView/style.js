// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const FullscreenViewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  z-index: ${zIndex.fullscreen};
  overflow-y: auto;
  -webkit-transform: translate3d(0, 0, 0);
`;

export const Illustrations = styled.span`
  z-index: ${zIndex.background};

  @media screen and (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const CloseLink = styled.a`
  color: ${theme.text.default};
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;
