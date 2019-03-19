// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FlexCol,
  FlexRow,
  H1,
  H2,
  H3,
  P,
  Transition,
  Shadow,
  hexa,
  Truncate,
  zIndex,
} from 'src/components/globals';
import Card from 'src/components/card';
import { StyledCard } from 'src/components/listItems/style';
import Icon from 'src/components/icon';
import { CommunityAvatar } from 'src/components/avatar';
import ScrollRow from 'src/components/scrollRow';
import { MEDIA_BREAK } from 'src/components/layout';

export const ViewTitle = styled(H1)`
  margin-left: 48px;
  margin-top: 48px;
  font-size: 32px;
  font-weight: 900;
  color: ${theme.text.reverse};
  position: relative;
  z-index: ${zIndex.base};

  @media (max-width: ${MEDIA_BREAK}px) {
    margin-left: 16px;
    margin-top: 16px;
  }
`;

export const ViewSubtitle = styled(H2)`
  margin-left: 48px;
  color: ${theme.text.reverse};
  position: relative;
  z-index: ${zIndex.base};

  @media (max-width: ${MEDIA_BREAK}px) {
    margin-left: 16px;
    font-size: 16px;
    line-height: 20px;
  }
`;

export const ListCard = styled(StyledCard)`
  padding: 0;
  @media (max-width: ${MEDIA_BREAK}px) {
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
  z-index: ${zIndex.base};
  align-self: stretch;
`;

export const SectionWrapper = styled(FlexRow)`
  flex: none;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: ${MEDIA_BREAK}px) {
    flex-direction: column;
  }
`;

export const ViewHeader = styled(Section)`
  flex: none;
  padding: 120px 0 0 0;
  justify-content: flex-end;
  background-color: ${theme.space.dark};
  background-image: ${({ theme }) =>
    `radial-gradient(farthest-corner at 50% 100%, ${hexa(
      theme.brand.alt,
      0.75
    )}, ${theme.space.dark} )`};

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 48px 24px 0 24px;
  }
`;

export const SectionWithGradientTransition = styled(Section)`
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.bg.default}, ${theme.bg.wash})`};

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 32px;
  }
`;

export const SectionTitle = styled(H2)`
  color: ${theme.text.default};
  margin-left: 16px;
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 800;

  @media (max-width: ${MEDIA_BREAK}px) {
    font-size: 24px;
  }
`;

export const SectionSubtitle = styled(H3)`
  color: ${theme.text.default};
  margin-bottom: 8px;
  margin-left: 48px;

  @media (max-width: ${MEDIA_BREAK}px) {
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

  &:after,
  &:before {
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
  background-color: ${theme.bg.default};
  color: ${theme.text.default};
  border-radius: 16px;
  margin-right: 24px;
  justify-content: space-between;
  position: relative;
  opacity: ${props => (props.active ? '0.85' : '1')};
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.text.placeholder, 1)};
  transition: ${Transition.hover.off};

  &:hover {
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.text.placeholder, 1)};
    transition: ${Transition.hover.on};
    opacity: 1;
  }
`;

export const ItemTitle = styled(H2)`
  font-weight: 700;
  color: ${theme.text.default};
`;

export const ItemCopy = styled(P)`
  color: ${theme.text.default};
  margin: 8px 0;
`;

export const ItemMeta = styled(ItemCopy)`
  font-weight: 900;
  color: ${theme.text.placeholder};
`;

export const Constellations = styled.div`
  background-color: transparent;
  background: url(/img/constellations.svg) center top no-repeat;
  position: absolute;
  background-size: cover 100%;
  z-index: ${zIndex.background};
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

export const SearchWrapper = styled(Card)`
  position: relative;
  margin-bottom: 0;
  padding: 12px 16px;
  box-shadow: ${Shadow.low} ${props => hexa(props.theme.bg.reverse, 0.15)};
  transition: ${Transition.hover.off};
  z-index: 14;
  border-radius: 8px;

  &:hover {
    box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.25)};
    transition: ${Transition.hover.on};
  }
`;

export const SearchInputWrapper = styled(FlexRow)`
  flex: auto;
  color: ${theme.text.placeholder};
`;

export const SearchIcon = styled(Icon)``;

export const SearchInput = styled.input`
  font-size: 16px;
  padding: 4px 20px 4px 12px;
  flex: auto;
  position: relative;
  z-index: ${zIndex.search};
`;

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  z-index: ${zIndex.search + 1};
`;

export const SearchResultsDropdown = styled.ul`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${Shadow.mid} ${props => hexa(props.theme.bg.reverse, 0.1)};
  position: absolute;
  top: 64px;
  left: 0;
  display: inline-block;
  width: 100%;
  flex: auto;
  max-height: 400px;
  overflow-y: auto;
  background: ${theme.bg.default};
  z-index: 12;
`;

export const SearchResultTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export const SearchResult = styled.li`
  display: flex;
  background: ${props =>
    props.focused ? props.theme.bg.wash : props.theme.bg.default};
  border-bottom: 1px solid ${theme.bg.border};

  &:hover {
    background: ${theme.bg.wash};
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
  ${Truncate()} padding: 8px 16px 8px 8px;
`;

export const SearchResultImage = styled(CommunityAvatar)``;

export const SearchResultMetaWrapper = styled(FlexCol)`
  margin-left: 16px;
  align-items: flex-start;
`;

export const SearchResultName = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  color: ${theme.text.default};
`;

export const SearchResultMetadata = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: ${theme.text.secondary};
`;

export const SearchResultNull = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: ${theme.bg.default};
  border: 0;

  &:hover {
    border: 0;

    p {
      color: ${theme.text.alt};
    }
  }

  a {
    margin-top: 16px;
  }

  p {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: ${theme.text.alt};
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const ListWithTitle = styled(FlexCol)`
  flex: auto;
`;

export const ListTitle = styled(H2)`
  border-bottom: 1px solid ${theme.bg.border};
  padding-bottom: 8px;
  padding-left: 16px;
  font-weight: 500;
  font-size: 18px;
  margin-top: 32px;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding-left: 32px;
  }
`;

export const ListWrapper = styled(FlexRow)`
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 1fr));
  align-items: start;
  grid-gap: 16px;
  padding-bottom: 32px;

  @media (max-width: ${MEDIA_BREAK}px) {
    grid-template-columns: repeat(2, minmax(320px, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ListItem = styled(FlexRow)``;

export const Collections = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export const CollectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  flex: auto;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 16px;
  }
`;

export const LoadingContainer = styled.div`
  padding: 32px;
`;

export const ProfileCardWrapper = styled.section`
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};
  border-radius: 4px;
  overflow: hidden;
`;
