import styled from 'styled-components';
import Card from '../../components/card';
import { FlexCol, Transition, zIndex } from '../../components/globals';
import { SegmentedControl } from '../../components/segmentedControl';
import { FullProfile, FullDescription } from 'src/components/profile/style';
import { ListContainer } from 'src/components/listItems/style';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr minmax(240px, 2fr);
  grid-template-rows: 160px 1fr;
  grid-template-areas: 'cover cover cover' 'meta content extras';
  grid-column-gap: 32px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.bg.default};

  @media (max-width: 1028px) {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 80px 1fr;
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

  > ${FullProfile} {
    margin-top: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    > ${FullProfile} {
      margin-top: 8px;
      margin-bottom: 8px;
    }

    ${FullDescription} {
      display: none;
    }
  }

  ${ListContainer} {
    margin: 8px 0 0 32px;
    width: auto;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }

  > div:nth-of-type(2) {
    display: flex;
    flex: none;
    margin: 16px 0 0 32px;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }

  > button,
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
  padding: 8px 16px 12px;
  margin-top: 24px;
  border-bottom: 2px solid ${props => props.theme.bg.border};
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
