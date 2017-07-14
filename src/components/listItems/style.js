import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Truncate,
  FlexCol,
  FlexRow,
  H3,
  H4,
  Transition,
} from '../../components/globals';
import Card from '../card';

export const Wrapper = styled(FlexCol)`
  flex: 0 0 auto;
  padding: 8px 0;
  justify-content: center;
  max-width: 100%;

  &:hover > div > div h3, &:hover .action {
    color: ${props => (props.clickable ? props.theme.brand.alt : '')};
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

  &:not(:first-of-type) {
    border-top: 2px solid ${props => props.theme.bg.wash};
  }
`;

export const Col = styled(FlexCol)`
  flex: 1;
`;

export const Row = styled(FlexRow)`
  flex: 0 0 auto;
  align-items: center;

  a {
    display: flex;
    align-items: center;
  }
`;

export const Heading = styled(H3)`
  font-weight: 700;
  transition: ${Transition.hover.off};
`;

export const Meta = styled(H4)`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.alt};

  ${props => (props.nowrap ? Truncate() : '')}
`;

export const ActionContainer = styled(FlexCol)`
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text.placeholder};
  transition: ${Transition.hover.off};
`;

export const StyledCard = styled(Card)`
  padding: 12px 16px 12px 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ListHeading = styled(H3)`
  font-weight: 900;
  font-size: 14px;
  color: ${({ theme }) => theme.text.placeholder};
`;

export const ListContainer = styled(FlexCol)`
  align-items: stretch;
  width: 100%;

  a + a {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const MoreLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.text.alt};
  transition: ${Transition.hover.off};
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.brand.alt};
  }

  > div {
    margin-right: 12px;
  }
`;

export const ListFooter = styled(FlexRow)`
  padding-top: 8px;
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  justify-content: flex-start;
  width: 100%;
`;

export const ListHeader = styled(FlexRow)`
  justify-content: space-between;
  width: 100%;
  padding-bottom: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  margin-top: ${props => (props.secondary ? '24px' : '0')};
`;

export const LargeListHeading = styled(H3)`
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }) => theme.text.default};
`;
export const Description = styled.p`
  margin-top: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.text.alt};

  strong {
    font-weight: 600;
    color: ${props => props.theme.text.default};
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
  background: #FFF1CC;
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
  color: ${props => props.theme.text.alt};
  position: relative;
  top: 2px;
  margin-left: -2px;
  margin-right: 4px;
`;
