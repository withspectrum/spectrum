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

export default styled.img`
  ${props => props.active && css`
    /* Pretend like there's a cursor next to the image when active */
    border-right: 1px solid black;
    animation: ${blinkBorder} 1s infinite;
  `}
`;
