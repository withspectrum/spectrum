// @flow
import styled from 'styled-components';
import { theme } from 'shared/theme';
import { tint } from 'src/components/globals';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.div`
  position: absolute;
  z-index: 1;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  pointer-events: none;
  color: ${theme.text.alt};
`;

export const Select = styled.select`
  padding: 8px 40px 8px 16px;
  border: none;
  border: 1px solid ${theme.bg.border};
  border-radius: 32px;
  overflow: hidden;
  box-shadow: none;
  background: ${theme.bg.default};
  background-image: none;
  -webkit-appearance: none;
  font-weight: 600;
  font-size: 15px;
  color: ${theme.text.default};
  text-align: center;
  text-align-last: center;

  option {
    text-align: left;
  }

  &:hover {
    cursor: pointer;
    background: ${theme.bg.divider};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${theme.bg.default}, 0 0 0 4px ${theme.bg.border};
    transition: box-shadow 0.2s ease-in-out;
  }

  &:active {
    box-shadow: 0 0 0 2px ${theme.bg.default},
      0 0 0 4px ${tint(theme.bg.border, -24)};
    transition: box-shadow 0.2s ease-in-out;
  }
`;
