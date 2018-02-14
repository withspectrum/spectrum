import styled from 'styled-components';
import { IconButton } from '../../components/buttons';
import Card from '../../components/card';
import { Button } from '../../components/buttons';
import {
  FlexCol,
  Transition,
  zIndex,
  Gradient,
} from '../../components/globals';
import {
  DesktopSegment,
  SegmentedControl,
} from '../../components/segmentedControl';

export const LoginButton = styled(Button)`
  width: 100%;
  font-size: 14px;
  font-weight: 700;
  background-color: ${props =>
    props.isMember ? props.theme.text.alt : props.theme.success.default};
  background-image: ${props =>
    props.isMember
      ? Gradient(props.theme.text.placeholder, props.theme.text.alt)
      : Gradient(props.theme.success.alt, props.theme.success.default)};
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

export const MidSegment = styled(DesktopSegment)`
  @media (min-width: 1281px) {
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
  align-self: flex-start;
  background-color: transparent;
  box-shadow: none;
  border: none;
  padding: 0;
  margin: 24px 0;
  border-radius: 0;
  background-image: none;
  color: ${props => props.theme.text.alt};

  &:hover {
    background-color: transparent;
    color: ${props => props.theme.brand.alt};
    box-shadow: none;
  }

  @media (max-width: 768px) {
    margin: 2px 0;
    padding: 16px 0;
    width: 100%;
    border-radius: 0;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr minmax(240px, 2fr);
  grid-template-rows: 240px 1fr;
  grid-template-areas: 'cover cover cover' 'meta content extras';
  grid-column-gap: 32px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.bg.default};

  @media (max-width: 1280px) {
    grid-template-columns: 320px 1fr;
    grid-template-rows: 160px 1fr;
    grid-template-areas: 'cover cover' 'meta content';
  }

  @media (max-width: 768px) {
    grid-template-rows: 80px auto 1fr;
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

export const Meta = styled(Column)`
  grid-area: meta;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    margin: 16px 0 0 32px;
  }

  > div:last-of-type {
    @media (max-width: 768px) {
      display: none;
    }
  }

  > a > button {
    margin-top: 16px;
    margin-left: 32px;
    width: calc(100% - 32px);

    @media (max-width: 768px) {
      margin-left: 0;
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0 32px;

    > div {
      margin-left: 0;
    }
  }
`;

export const Content = styled(Column)`
  grid-area: content;
  min-width: 0;
  align-items: stretch;

  @media (max-width: 1280px) and (min-width: 768px) {
    padding-right: 32px;
  }

  @media (max-width: 768px) {
    > ${SegmentedControl} > div {
      margin-top: 0;
    }
  }
`;

export const Extras = styled(Column)`
  grid-area: extras;

  > ${FlexCol} > div {
    border-top: 0;
    padding: 0;
    padding-top: 24px;

    h3 {
      font-size: 16px;
      line-height: 1.2;
    }
  }

  @media (max-width: 1280px) {
    display: none;
  }

  @media (min-width: 768px) {
    padding-right: 32px;
  }
`;

export const ColumnHeading = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  font-weight: 500;
  padding: 16px;
  margin-top: 16px;
  border-bottom: 2px solid ${props => props.theme.bg.border};
`;
