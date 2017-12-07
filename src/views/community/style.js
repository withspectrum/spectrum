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

export const CoverRow = styled(FlexRow)`
  align-items: flex-start;
  ${/* See class .flexy below - there's a hack on this element bc reasons 🙄 */ ''} > .inset {
    position: relative;
    top: -64px;

    @media (max-width: 768px) {
      top: auto;
      flex: none;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;

    > div {
      margin-top: 0;
      padding-top: 2px;
    }
  }
`;

export const CoverColumn = styled(FlexCol)`
  width: 90%;
  max-width: 1024px;
  padding-top: 32px;

  ${/* For some goddamn reason, CoverRow will *not* take this property... ughhhhhhhhh */ ''} > .flexy {
    display: flex;
  }

  @media (max-width: 768px) {
    padding-top: 0;
    width: 100%;
    overflow-y: scroll;
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

export const SegmentedControl = styled(FlexRow)`
  align-self: flex-end;
  margin-top: -24px;
  margin-bottom: 8px;
  padding: 8px 4px;

  @media (max-width: 768px) {
    background-color: ${props => props.theme.bg.default};
    align-self: stretch;
    margin: 0;
    padding: 16px 8px;
    margin-bottom: 2px;
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
