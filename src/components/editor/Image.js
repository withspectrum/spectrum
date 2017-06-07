import styled, { css, keyframes } from 'styled-components';

const blinkBorder = keyframes`
  0% {
    border-color: transparent;
  }
  49% {
    border-color: transparent;
  }
  50% {
    border-color: black;
  }
  100% {
    border-color: black;
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  margin: 12px 0;
  ${props => props.active && css`
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(56, 24, 229, 0.2);
  `}

  transition: all 0.1s ease-in-out;
`;

export const ActiveOverlay = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(56, 24, 229, 0.1);
  border-radius: 8px;
  border: 1px solid ${props => props.theme.brand.default};
  opacity: ${props => (props.active ? 1 : 0)};
  transition: all 0.1s ease-in-out;
`;

export default styled.img`
  ${props => props.active && css`
    /* Pretend like there's a cursor next to the image when active */
    box-shadow: inset -1px 0 0 #000;
    animation: ${blinkBorder} 1s infinite;
  `}
  max-width: 100%;
`;
