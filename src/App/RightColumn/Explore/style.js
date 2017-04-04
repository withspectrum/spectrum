import styled from 'styled-components';
import {
  FlexCol,
  FlexRow,
  H1,
  H2,
  H3,
  P,
  Transition,
  Gradient,
  Button,
} from '../../../shared/Globals';
import ScrollRow from '../../../shared/ScrollRow';

export const ViewContainer = styled(FlexCol)`
  flex: 1 1 auto;
  align-self: stretch;
  padding: 48px;
  overflow: hidden;
  overflow-y: scroll;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ScrollBody = styled(FlexCol)`
  flex: 0 0 auto;
  margin-top: 16px;
  overflow-y: scroll;
  position: relative;
`;

export const ViewTitle = styled(H1)`
  font-size: 32px;
  font-weight: 900;
  color: ${props => props.theme.text.default};
`;

export const ViewSubtitle = styled(H3)`
  color: ${props => props.theme.text.default};
`;

export const Section = styled(FlexCol)`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
`;

export const SectionTitle = styled(H2)`
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const Row = styled(ScrollRow)`
  max-width: 100%;
  width: 100%;
  flex: 0 0 320px;
  padding: 8px 16px 32px 16px;

  &:after{
    content: '';
    display: inline-block;
    flex: 0 0 32px;
    align-self: stretch;
    background-color: transparent;
  }
`;

export const Item = styled(FlexCol)`
  padding: 16px;
  flex: 0 0 280px;
  flex-order: ${props => props.active ? '2' : '1'};
  background-color: ${props => props.theme.bg.default};
  color: ${props => props.theme.text.default};
  border-radius: 16px;
  margin-right: 24px;
  justify-content: space-between;
  position: relative;
  box-shadow: ${props =>
  props.active
    ? '0 2px 8px rgba(23,26,33, 0.25)'
    : '0 4px 16px rgba(23,26,33, 0.25)'};
  transition: ${Transition.hover.off};

  &:hover {
    box-shadow: 0 8px 32px rgba(23, 26, 33, 0.35);
    transition: ${Transition.hover.on};
  }
`;

export const ItemTitle = styled(H2)`
  font-weight: 700;
  color: ${props => props.theme.text.default};
`;

export const ItemCopy = styled(P)`
  color: ${props => props.theme.text.default};
  margin: 8px 0;
`;

export const ItemMeta = styled(ItemCopy)`
  font-weight: 900;
  color: ${props => props.theme.text.placeholder};
`;

export const ButtonContainer = styled(FlexRow)`
  justify-content: flex-end;
`;

export const ItemButton = styled(Button)`
  font-weight: 700;
  color: ${props => props.theme.text.reverse};
  background-color: ${props =>
  props.active ? props.theme.text.placeholder : props.theme.brand.default};
  background-image: ${props =>
  props.active
    ? 'none'
    : Gradient(props.theme.brand.alt, props.theme.brand.default)};
  box-shadow: none;
  transition: ${Transition.hover.on};

  &:hover {
    box-shadow: none;
  }
`;
