// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Shadow, zIndex } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const GalleryWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: ${zIndex.fullscreen};
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.bg.reverse};
  opacity: 0.95;
  z-index: ${zIndex.fullscreen + 1};
`;

export const ActiveImage = styled.img`
  position: absolute;
  left: 50%;
  top: 47%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  max-height: 90%;
  width: 100%;
  max-width: ${MEDIA_BREAK}px;
  margin: auto 0 5rem;
  box-shadow: ${Shadow.high};
  z-index: ${zIndex.fullscreen + 2};
`;

export const Minigallery = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 0.25rem;
  background: #000;
  max-height: 3rem;
  z-index: ${zIndex.fullscreen + 1};
`;
export const MiniImg = styled.img`
  height: 2rem;
  border-radius: 2px;
  margin: 0.25rem;
  opacity: ${props => (props.active ? 1 : 0.5)};
  transition: opacity 0.2s ease-in-out;
  max-width: 64px;

  &:hover {
    transition: opacity 0.2s ease-in-out;
    cursor: pointer;
    opacity: ${props => (props.active ? 1 : 0.7)};
  }
`;

export const MiniContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: ${MEDIA_BREAK}px) {
    justify-content: flex-start;
    overflow-x: scroll;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  -webkit-appearance: none;
  top: 4px;
  right: 4px;
  padding: 8px 12px;
  border-radius: 23px;
  background: #000;
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  z-index: ${zIndex.fullscreen + 2};
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;
