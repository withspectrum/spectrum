// @flow
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  FlexCol,
  FlexRow,
  H1,
  H2,
  H3,
  P,
  Transition,
  Gradient,
  Shadow,
  hexa,
  Truncate,
} from '../../components/globals';
import { StyledCard } from '../../components/listItems/style';
import ScrollRow from '../../components/scrollRow';

import { Button } from '../../components/buttons';

export const ViewContainer = styled(FlexCol)`
  flex: auto;
  align-self: stretch;
  overflow: hidden;
  overflow-y: scroll;
`;

export const ScrollBody = styled(FlexCol)`
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.bg.wash};
`;

export const ViewTitle = styled(H1)`
  margin-left: 48px;
  margin-top: 48px;
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.reverse};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-left: 16px;
    margin-top: 16px;
  }
`;

export const ViewSubtitle = styled(H2)`
  margin-left: 48px;
  color: ${({ theme }) => theme.text.reverse};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-left: 16px;
    font-size: 16px;
    line-height: 20px;
  }
`;

export const ListCard = styled(StyledCard)`
padding: 0;
@media (max-width: 768px) {
  display: flex;
  margin-bottom: 32px;
}
`;

export const Section = styled(FlexCol)`
  padding: 32px;
  padding-top: 0;
  display: flex;
  flex: none;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  align-self: stretch;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const SectionWrapper = styled(FlexRow)`
  flex: none;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ViewHeader = styled(Section)`
  flex: none;
  padding: 120px 0 160px 0;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.space.dark};
  background-image: ${({ theme }) =>
    `radial-gradient(farthest-corner at 50% 100%, ${hexa(
      theme.brand.alt,
      0.75
    )}, ${theme.space.dark} )`};

  @media (max-width: 768px) {
    padding: 48px 24px 96px 24px;
  }
`;

export const SectionWithGradientTransition = styled(Section)`
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.bg.default}, ${theme.bg.wash})`};

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

export const SectionTitle = styled(H2)`
  color: ${({ theme }) => theme.text.default};
  margin-left: 16px;
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const SectionSubtitle = styled(H3)`
  color: ${({ theme }) => theme.text.default};
  margin-bottom: 8px;
  margin-left: 48px;

  @media (max-width: 768px) {
    margin-left: 16px;
  }
`;

export const Row = styled(ScrollRow)`
  max-width: 100%;
  width: 100%;
  flex: 0 0 320px;
  padding: 8px 16px 32px 16px;
  overflow-x: scroll;
  align-items: flex-start;

  &:after, &:before{
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
  flex-order: ${props => (props.active ? '2' : '1')};
  background-color: ${({ theme }) => theme.bg.default};
  color: ${({ theme }) => theme.text.default};
  border-radius: 16px;
  margin-right: 24px;
  justify-content: space-between;
  position: relative;
  opacity: ${props => (props.active ? '0.85' : '1')};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.text.placeholder, 1)};
  transition: ${Transition.hover.off};

  &:hover {
    box-shadow: ${Shadow.high} ${props =>
  hexa(props.theme.text.placeholder, 1)};
    transition: ${Transition.hover.on};
    opacity: 1;
  }
`;

export const ItemTitle = styled(H2)`
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
`;

export const ItemCopy = styled(P)`
  color: ${({ theme }) => theme.text.default};
  margin: 8px 0;
`;

export const ItemMeta = styled(ItemCopy)`
  font-weight: 900;
  color: ${({ theme }) => theme.text.placeholder};
`;

export const ButtonContainer = styled(FlexRow)`
  justify-content: ${props => (props.center ? 'center' : 'flex-end')};
  align-items: center;

  > div {
    margin-right: 8px;
  }
`;

export const ItemButton = styled(Button)`
  font-weight: 700;
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${props =>
    props.joined ? props.theme.inactive : props.theme.brand.default};
  background-image: ${props =>
    props.joined
      ? 'none'
      : Gradient(props.theme.brand.alt, props.theme.brand.default)};
  box-shadow: none;
  transition: ${Transition.hover.on};

  &:hover {
    box-shadow: none;
  }
`;

export const Constellations = styled.div`
  background-color: transparent;
  background: url(/img/constellations.svg) center top no-repeat;
  position: absolute;
  background-size: cover 100%;
  z-index: 0;
  height: calc(100% + 4px);
  width: 110%;
  top: -10px;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`;

export const ErrorState = styled(FlexCol)`
  width: 100%;
  margin-top: 32px;
  h2 {
    text-align: center;
    opacity: 0.5;
  }

  p {
    text-align: center;
    opacity: 0.5;
  }
  &:not(:first-of-type) {
    display: none;
  }
`;

export const ComposerInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  display: block;
  margin-bottom: 48px;
`;

export const ComposerInput = styled.input`
  font-size: 16px;
  padding: 15px 16px;
  width: 100%;
  border: 2px solid ${props => props.theme.border.default};
  border-radius: 8px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  z-index: 5;
`;

export const SearchResultsDropdown = styled.ul`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 54px;
  left: 0;
  display: inline-block;
  width: 100%;
  max-height: 420px;
  overflow-y: scroll;
  z-index: 1000;
  background: #fff;

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    border-radius: 0 0 8px 8px;
  }
`;

export const SearchResultTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

export const SearchResult = styled.li`
  display: flex;
  background: ${props => (props.focused ? props.theme.bg.wash : '#fff')};
  border-bottom: 2px solid ${props => props.theme.border.default};

  &:hover {
    background: ${props => props.theme.bg.wash};
    cursor: pointer;
  }

  &:only-child {
    border-bottom: none;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const SearchLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  ${Truncate()}
  padding: 8px 16px 8px 8px;
`;

export const SearchResultImage = styled.img`
  margin-right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const SearchResultDisplayName = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  line-height: 1.4;
`;

export const SearchResultUsername = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  line-height: 1.4;
`;

export const SearchResultNull = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;

  a {
    margin-top: 16px;
  }

  p {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.text.alt};
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const TopCommunityItem = styled.div`
  border-bottom: 2px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: transparent;
`;
