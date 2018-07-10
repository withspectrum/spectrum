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
