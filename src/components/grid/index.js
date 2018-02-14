import styled from 'styled-components';
import { FlexCol, Transition, zIndex } from '../globals';
import { SegmentedControl } from '../segmentedControl';
import { FullProfile, FullDescription } from '../profile/style';
import { ListContainer } from '../listItems/style';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 3fr minmax(240px, 2fr);
  grid-template-rows: ${props => (props.subview ? '160px' : '240px')} 1fr;
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
    grid-template-rows: ${props => (props.subview ? '80px' : '160px')} 1fr;
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

  @media (max-width: 768px) {
    ${FullDescription} {
      display: none;
    }

    padding: 0 32px;
  }

  ${LoginButton} {
    margin-top: 16px;
    margin-left: 32px;
    width: calc(100% - 32px);

    @media (max-width: 768px) {
      margin-left: 0;
      width: 100%;
    }
  }

  > ${FullProfile} {
    margin-top: 16px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  ${ListContainer} {
    margin: 8px 0 0 32px;
    width: auto;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }

  > ${ToggleChannelMembership} {
    display: flex;
    flex: none;
    margin: 16px 0 0 32px;

    @media (max-width: 768px) {
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

  ${SegmentedControl} {
    margin: 16px 0 0 0;
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

  + div {
    padding: 8px 16px;
  }
`;
