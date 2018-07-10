// @flow
import styled from 'styled-components';
import { zIndex } from 'src/components/globals';

export const HoverWrapper = styled.div`
  position: absolute;
  z-index: ${zIndex.tooltip};
  width: 256px;
  ${props => props.popperStyle};

  @media (max-width: 768px) {
    display: none;
    pointer-events: none;
  }

  &:hover {
    display: inline-block;
  }
`;

export const Span = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  position: relative;
`;

export const ProfileCard = styled.div`
  width: 256px;
  background: ${props => props.theme.bg.default};
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.bg.wash};
  min-height: 128px;
`;
