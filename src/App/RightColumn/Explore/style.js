import styled from 'styled-components';
import {
  FlexCol,
  FlexRow,
  H1,
  H2,
  H3,
  P,
  Shadow,
  Transition,
} from '../../../shared/Globals';

export const Wrapper = styled(FlexCol)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
`;

export const ViewTitle = styled(H1)`
  margin-top: 48px;
  margin-left: 48px;
  font-size: 32px;
  font-weight: 900;
  color: ${props => props.theme.text.default};
`;

export const ViewSubtitle = styled(H3)`
  color: ${props => props.theme.text.default};
  margin-left: 48px;
`;

export const FeaturedSection = styled(FlexCol)`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;

  > h2 {
    margin-left: 48px;
  }
`;

export const SectionTitle = styled(H2)`
  color: ${props => props.theme.text.default};
`;

export const FeaturedRow = styled(FlexRow)`
  max-width: 100%;
  overflow-x: scroll;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 40px;
  margin-top: 8px;
  box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.15);
`;

export const FeaturedItem = styled(FlexCol)`
  max-width: 33%;
  min-width: 280px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${props => props.theme.bg.default};
  margin: 0 8px;

  &:last-of-type {
    margin-right: 32px;
  }
`;

export const FeaturedItemMeta = styled(FlexCol)`
  padding: 16px;
  border: 2px solid ${props => props.theme.border.default};
  border-top: none;
  border-radius: 0 0 12px 12px;
`;

export const FeaturedItemImage = styled.img`
  height: 120px;
  width: 100%;
  object-fit: cover;
`;

export const FeaturedItemTitle = styled(H2)`
  color: ${props => props.theme.text.default};
`;

export const FeaturedItemCopy = styled(P)`
  color: ${props => props.theme.text.default};
  margin: 8px 0;
`;

export const SecondaryRow = styled(FlexRow)`
  max-width: 100%;
  overflow-x: scroll;
  width: 100%;
  flex: 0 0 auto;
  padding: 16px 32px;
  padding-top: 8px;
`;

export const SecondaryItem = styled(FlexCol)`
  padding: 32px 16px 16px 16px;
  flex: 0 0 160px;
  border: 2px solid ${props => props.theme.border.default};
  background-color: ${props => props.theme.bg.default};
  color: ${props => props.theme.text.default};
  border-radius: 12px;
  margin: 8px;
  justify-content: space-between;

  > h3 {
    margin: 16px 0;
    font-weight: 700;
  }

  &:first-of-type {
    margin-left: 16px;
  }

  &:last-of-type {
    margin-right: 32px;
  }
`;

export const ChartSection = styled(FlexRow)`
  margin-top: 32px;
  margin-left: 48px;
  justify-content: space-around;
`;

export const Chart = styled(FlexCol)`
  flex: 1 0 auto;
  max-width: 480px;
  height: 960px;
  margin-right: 32px;
`;

export const ScrollBody = styled(FlexCol)`
  flex: 0 0 auto;
  margin-top: 16px;
  overflow-y: scroll;
  position: relative;

  &:before {
    position: absolute;
    pointer-events: none;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 2% );
  }
`;

export const ChartRow = styled(FlexRow)`
  padding: 16px;
  border-bottom: 2px solid ${props => props.theme.border.default};

    div {
      flex: 1 0 auto;
      justify-content: space-between;

      h1 {
        font-size: 24px;
        font-weight: 700;
      }

      h3 {
        font-weight: 700;
        font-size: 14px;
        color: ${props => props.theme.text.placeholder};
      }
    }

    > h1 {
      font-size: 40px;
      display: inline-block;
      height: 48px;
      line-height: 48px;
      width: 48px;
      font-weight: 300;
      margin-right: 16px;
      align-self: stretch;
      text-align: center;
      vertical-align: center;
      color: ${props => props.theme.text.placeholder};
    }

    button {
      min-width: 80px;
    }
  }
`;

export const Rank = styled(H1)`
  font-size: 40px;
  display: inline-block;
  height: 100%;
  width: 40px;
  font-weight: 900;
  margin-right: 16px;
  align-self: stretch;
`;
