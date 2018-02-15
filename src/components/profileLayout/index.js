import styled, { css } from 'styled-components';
import { FlexCol } from '../globals';
import { SegmentedControl } from '../segmentedControl';
import { FullProfile, FullDescription } from '../profile/style';
import { ListContainer } from '../listItems/style';
import { MembershipContainer } from '../toggleMembership/style';
import { ProfileCTA } from '../profile/style';
import { StyledCard } from '../card';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Meta = styled(Column)`
  grid-area: meta;
  padding-left: 32px;

  @media (max-width: 768px) {
    ${FullDescription} {
      display: none;
    }

    padding: 0 32px;
  }

  > ${StyledCard} {
    margin-top: 8px;
    margin-left: 0;
  }

  ${ProfileCTA} {
    margin-top: 16px;
  }

  > ${FullProfile} {
    margin-left: 0;
    margin-top: 16px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }

  ${ListContainer} {
    margin-top: 8px;
    width: auto;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }

  > ${MembershipContainer} {
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

  ${props =>
    !props.subview &&
    css`
      ${Meta} {
        margin-top: -64px;

        ${FullProfile} {
          margin-top: 0;
        }

        @media (max-width: 768px) {
          margin-top: -48px;
        }
      }
    `} @media (max-width: 1280px) {
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
