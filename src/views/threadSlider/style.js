// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { zIndex } from 'src/components/globals';
import {
  MEDIA_BREAK,
  MIN_MAX_WIDTH,
  TITLEBAR_HEIGHT,
  NAVBAR_WIDTH,
} from 'src/components/layout';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  z-index: ${zIndex.slider + 1};
  position: absolute;
  left: ${NAVBAR_WIDTH}px;
  right: 0;
  top: 0;
  bottom: 0;

  @media (max-width: ${MEDIA_BREAK}px) {
    top: ${TITLEBAR_HEIGHT}px;
    left: 0;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.24);
  z-index: 0;
`;

export const ThreadBackground = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background: ${theme.bg.wash};
  width: ${MIN_MAX_WIDTH}px;
  left: 50%;
  transform: translateX(calc(-50%));

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100%;
  }
`;

export const ThreadContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: ${zIndex.slider + 4};

  @media (max-width: ${MEDIA_BREAK}px) {
    max-width: 100%;
    box-shadow: 0;
  }
`;

export const CloseButton = styled.span`
  position: fixed;
  top: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.bg.reverse};
  color: ${theme.text.reverse};
  z-index: ${zIndex.slider + 4};
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;
