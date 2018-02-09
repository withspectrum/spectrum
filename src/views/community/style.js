import styled from 'styled-components';
import { IconButton } from '../../components/buttons';
import Card from '../../components/card';
import { Button } from '../../components/buttons';
import {
  FlexRow,
  FlexCol,
  Transition,
  Shadow,
  hexa,
  zIndex,
} from '../../components/globals';
import { DesktopSegment } from '../../components/segmentedControl';

export const LogoutButton = styled(Button)`
  width: 100%;
  margin: 16px 0;
  padding: 16px 0;
  background-image: none;
  background-color: ${props => props.theme.text.alt};

  &:hover {
    background-color: ${props => props.theme.warn.default};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const CoverButton = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    bottom: 16px;
    top: auto;
  }
`;

export const Segment = styled(FlexRow)`
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
  font-size: 14px;
  font-weight: ${props => (props.selected ? '900' : '500')};
  color: ${props =>
    props.selected ? props.theme.text.default : props.theme.text.alt};
  cursor: pointer;

  + div {
    border-left: 2px solid ${props => props.theme.bg.border};
  }

  &:hover {
    color: ${props =>
      props.selected ? props.theme.text.default : props.theme.text.default};
  }

  @media (max-width: 768px) {
    flex: auto;
    justify-content: space-around;
  }
`;

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

export const MidSegment = styled(DesktopSegment)`
  @media (min-width: 1028px) {
    display: none;
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

export const StyledButton = styled(Button)`
  flex: none;

  @media (max-width: 768px) {
    margin: 2px 0;
    padding: 16px 0;
    width: 100%;
    border-radius: 0;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr auto;
  grid-template-rows: 240px 1fr;
  grid-template-areas: 'cover cover cover' 'meta content extras';
  grid-column-gap: 32px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 100%:
  min-height: 100vh;
  background-color: ${props => props.theme.bg.default};

  @media (max-width: 960px) {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 160px 1fr;
    grid-template-areas: 'cover cover' 'meta content';
  }

  @media (max-width: 768px) {
    grid-template-rows: 80px 1fr auto;
    grid-template-columns: 100%;
    grid-column-gap: 0;
    grid-row-gap: 16px;
    grid-template-areas: 'cover' 'meta' 'content';
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Meta = styled(Column)``;

export const Content = styled(Column)``;

export const Extras = styled(Column)``;
