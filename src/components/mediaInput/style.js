import styled from 'styled-components';
import { zIndex } from '../globals';

export const MediaInput = styled.input`
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: ${zIndex.hidden};
`;

export const MediaLabel = styled.label`
  border: none;
  outline: 0;
  display: inline-block;
  background: transparent;
  transition: all 0.3s ease-out;
  color: ${({ theme }) => theme.text.placeholder};
  height: 32px;
  width: 32px;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.brand.alt};
  }
`;
