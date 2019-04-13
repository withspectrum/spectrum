// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';

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
  transition: color 0.3s ease-out;
  color: ${theme.text.placeholder};
  height: 32px;
  width: 32px;
  margin: 4px;

  &:hover {
    cursor: pointer;
    color: ${theme.brand.alt};
  }
`;

export const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
`;
