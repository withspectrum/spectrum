// @flow
import styled from 'styled-components';
import { theme } from 'shared/theme';

export const StyledSelect = styled.div`
  border: 1px solid ${theme.bg.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const Select = styled.select`
  padding: 4px 12px;
  width: 130%;
  border: none;
  box-shadow: none;
  background: ${theme.bg.default};
  background-image: none;
  -webkit-appearance: none;
  font-weight: 400;
  font-size: 14px;
  color: ${theme.text.default};
`;
