import styled from 'styled-components';
import { FlexRow, FlexCol } from '../../components/globals';
import Card from '../../components/card';
import { Button } from '../../components/buttons';
import { Transition, Shadow, hexa, zIndex } from '../../components/globals';

export const Row = styled(FlexRow)`
  padding: 8px 16px;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.text.alt};

  div {
    margin-top: 2px;
    margin-right: 8px;
    color: inherit;
  }

  span {
    line-height: 1;
    color: inherit;
  }

  &:hover {
    background-color: ${({ theme }) => theme.brand.alt};
    color: ${({ theme }) => theme.text.reverse};
  }
`;

export const Col = styled(FlexCol)`
  width: 100%;

  a + a > div {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const RowLabel = styled.span`font-weight: 600;`;

export const SearchContainer = styled(Card)`
  margin-bottom: 16px;
  position: relative;
  z-index: ${zIndex.search};
  width: 100%;
  display: block;
  min-height: 64px;
  border-radius: 12px;
  transition: ${Transition.hover.off};

  &:hover {
    transition: none;
    box-shadow: ${Shadow.high}
      ${({ theme }) => hexa(theme.text.placeholder, 0.5)};
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
