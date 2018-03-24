import styled from 'styled-components';
import Card from '../card';
import { zIndex, Transition } from '../globals';

export const SearchContainer = styled(Card)`
  border-bottom: 2px solid ${props => props.theme.bg.border};
  position: relative;
  z-index: ${zIndex.search};
  width: 100%;
  display: block;
  min-height: 64px;
  transition: ${Transition.hover.off};

  &:hover {
    transition: none;
    border-bottom: 2px solid ${props => props.theme.brand.alt};
  }

  @media (max-width: 768px) {
    border-radius: 0;
    pointer-events: all;
    margin-bottom: 0;
  }
`;

export const SearchInput = styled.input`
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  color: ${props => props.theme.text.default};
  transition: ${Transition.hover.off};
  font-size: 20px;
  font-weight: 800;
  margin-left: 8px;
  width: 97%;
  border-radius: 12px;
`;
