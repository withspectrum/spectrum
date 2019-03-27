// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Link } from 'react-router-dom';
import { MEDIA_BREAK } from 'src/components/layout';
import {
  Truncate,
  FlexCol,
  FlexRow,
  H3,
  H4,
  Transition,
} from 'src/components/globals';

export const Wrapper = styled(FlexCol)`
  flex: 1 0 auto;
  padding: 12px 0;
  justify-content: center;
  max-width: 100%;
  border-top: 1px solid
    ${props => (props.border ? props.theme.bg.border : 'transparent')};

  &:first-of-type {
    border-top: 0;
  }

  &:last-of-type:not(:first-of-type) {
    padding-bottom: 0;
  }

  &:hover > div > div h3,
  &:hover .action {
    color: ${props => (props.isClickable ? props.theme.brand.alt : '')};
  }
`;

export const WrapperLi = styled.li`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  padding: 8px 0;
  justify-content: center;
  max-width: 100%;
  list-style-type: none;
`;

export const Col = styled(FlexCol)`
  flex: auto;
  min-width: 0;
`;

export const Row = styled(FlexRow)`
  flex: 1 0 auto;
  align-items: flex-center;

  a {
    display: flex;
    align-items: center;
  }
`;

export const Heading = styled(H3)`
  font-weight: 500;
  font-size: 16px;
  transition: ${Transition.hover.off};
  line-height: 1.2;
  display: flex;
  align-items: center;
  ${Truncate};

  > div {
    color: ${theme.text.alt};
    margin-right: 4px;
  }
`;

export const Meta = styled(H4)`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.text.alt};

  a {
    display: inline-block;
  }

  ${props => (props.nowrap ? Truncate() : '')};
`;

export const ActionContainer = styled(FlexCol)`
  justify-content: center;
  align-items: center;
  color: ${theme.text.placeholder};
  transition: ${Transition.hover.off};
`;

export const StyledCard = styled.div`
  flex-direction: column;
  display: ${props => (props.smallOnly ? 'none' : 'flex')};

  @media (max-width: ${MEDIA_BREAK}px) {
    display: ${props => (props.largeOnly ? 'none' : 'flex')};
  }
`;

export const ListHeading = styled(H3)`
  font-weight: 500;
  font-size: 18px;
  padding: 16px;
  padding-left: 0;
  color: ${theme.text.default};
`;

export const ListContainer = styled(FlexCol)`
  align-items: stretch;
  width: 100%;
`;

export const MoreLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${theme.text.alt};
  transition: ${Transition.hover.off};
  padding: 0;

  &:hover {
    color: ${theme.brand.alt};
  }

  > div {
    margin-right: 12px;
  }
`;

export const ListFooter = styled(FlexRow)`
  padding-top: 8px;
  border-top: 2px solid ${theme.bg.wash};
  justify-content: flex-start;
  width: 100%;
`;

export const ListHeader = styled(FlexRow)`
  justify-content: space-between;
  width: 100%;
  border-bottom: 2px solid ${theme.bg.border};
  margin-top: ${props => (props.secondary ? '24px' : '0')};
`;

export const LargeListHeading = styled(H3)`
  font-weight: 800;
  font-size: 20px;
  color: ${theme.text.default};
`;
export const Description = styled.div`
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${theme.text.alt};

  strong {
    font-weight: 600;
    color: ${theme.text.default};
  }

  &:last-of-type {
    margin-bottom: 16px;
  }

  &:only-of-type {
    margin-bottom: 0;
  }
`;

export const Notice = styled(Description)`
  padding: 8px 12px;
  margin: 16px 0;
  border-radius: 4px;
  background: #fff1cc;
  border: 1px solid #ffd566;
  color: #715818;

  a {
    text-decoration: underline;
  }

  strong {
    font-weight: 600;
  }
`;

export const InlineIcon = styled.span`
  position: relative;
  top: 2px;
`;

export const BadgeContainer = styled(FlexCol)`
  justify-content: center;
  flex: 0 0 40px;
  margin-right: 8px;
`;

export const Lock = styled.span`
  color: ${theme.text.alt};
  position: relative;
  top: 2px;
  margin-left: -2px;
  margin-right: 4px;
`;
