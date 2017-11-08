// @flow
import styled, { css } from 'styled-components';
import { zIndex } from '../globals';

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
  align-items: center;
  z-index: ${zIndex.fullscreen};
  overflow-y: scroll;
  -webkit-transform: translate3d(0, 0, 0);
`;

export const Illustrations = styled.span`
  z-index: ${zIndex.background};

  ${p =>
    !p.showBackgroundOnMobile &&
    css`
      @media screen and (max-width: 768px) {
        display: none;
      }
    `};
`;

export const Close = styled.div`
  color: ${props => props.theme.text.default};
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;
