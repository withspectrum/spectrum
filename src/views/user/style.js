// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { FlexRow, FlexCol } from 'src/components/globals';
import Card from 'src/components/card';
import { Transition, zIndex } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const Row = styled(FlexRow)`
  padding: 8px 16px;
  align-items: center;
  width: 100%;
  color: ${theme.text.alt};

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
    background-color: ${theme.brand.alt};
    color: ${theme.text.reverse};
  }
`;

export const Col = styled(FlexCol)`
  width: 100%;

  a + a > div {
    border-top: 2px solid ${theme.bg.wash};
  }
`;

export const RowLabel = styled.span`
  font-weight: 600;
`;

export const SearchContainer = styled(Card)`
  border-bottom: 1px solid ${theme.bg.border};
  background: ${theme.bg.wash};
  position: relative;
  z-index: ${zIndex.search};
  width: 100%;
  display: flex;
  padding: 8px 12px;
  transition: ${Transition.hover.off};
  display: flex;
  align-items: center;

  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
    pointer-events: all;
    margin-bottom: 0;
  }
`;

export const SearchInput = styled.input`
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  color: ${theme.text.default};
  transition: ${Transition.hover.off};
  font-size: 16px;
  font-weight: 500;
  border-radius: 100px;
  background: ${theme.bg.default};
  border: 1px solid ${theme.bg.border};

  &:focus {
    border: 1px solid ${theme.text.secondary};
  }
`;

export const Grid = styled.main`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr minmax(240px, 2fr);
  grid-template-rows: 240px 1fr;
  grid-template-areas: 'cover cover cover' 'meta content extras';
  grid-column-gap: 32px;
  width: 100%;
  max-width: 1280px;
  min-height: 100vh;
  background-color: ${theme.bg.default};
  box-shadow: inset 1px 0 0 ${theme.bg.border},
    inset -1px 0 0 ${theme.bg.border};

  @media (max-width: 1028px) {
    grid-template-columns: 320px 1fr;
    grid-template-rows: 160px 1fr;
    grid-template-areas: 'cover cover' 'meta content';
  }

  @media (max-width: ${MEDIA_BREAK}px) {
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

  > button,
  > a > button {
    margin-top: 16px;
    margin-left: 32px;
    width: calc(100% - 32px);

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-left: 0;
      width: 100%;
    }
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 0 16px;

    > div {
      margin-left: 0;
    }
  }
`;

export const MetaMemberships = styled.div`
  margin-left: 32px;

  @media (min-width: 1279px) {
    display: none;
  }

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
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
  border-bottom: 2px solid ${theme.bg.border};
`;
