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
    border-radius: 0;
    margin: 0;
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

// export const Segment = styled(FlexRow)`
//   border: 2px solid ${props => props.theme.text.alt};
//   border-right: none;
//   border-left: none;
//   background-color: ${props => props.selected ? props.theme.text.alt : 'transparent'};
//   color: ${props => props.selected ? props.theme.text.reverse : props.theme.text.alt };
//   flex: auto;
//   justify-content: center;
//   align-items: center;
//   font-size: 14px;
//   font-weight: bold;
//   padding: 8px 0;
//   cursor: pointer;
//   transition: ${Transition.hover.off};
//
//   ${'' /*
//   Trying to figure out borders between sections that disappear when adjacent to a selected item. So far... not easy.
//   ${props => props.selected || css`
//     + & {
//       border-left: ${props => props.selected ? 'none' : `2px solid ${props.theme.text.alt}`};
//     }
//   `}; */}
//
//   &:hover {
//     transition: ${Transition.hover.on};
//     border-color: ${props => props.selected ? hexa(props.theme.text.alt, 0.01) : props.theme.text.alt};
//     background-color: ${props => props.selected ? hexa(props.theme.text.alt, 0.75) : props.theme.border.default};
//   }
//
//   &:first-of-type {
//     border: 2px solid ${props => props.theme.text.alt};
//     border-right: none;
//     border-radius: 12px 0 0 12px;
//     &:hover {
//       border-color: ${props => props.selected ? hexa(props.theme.text.alt, 0.01) : props.theme.text.alt};
//     }
//   }
//
//   &:last-of-type {
//     border: 2px solid ${props => props.theme.text.alt};
//     border-left: none;
//     border-radius: 0 12px 12px 0;
//     &:hover {
//       border-color: ${props => props.selected ? hexa(props.theme.text.alt, 0.01) : props.theme.text.alt};
//     }
//   }
// `;

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
    border-left: 2px solid ${props => props.theme.border.default};
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
  width: 100%;
  border-radius: 12px;
`;
