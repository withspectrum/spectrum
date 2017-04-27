import styled from 'styled-components';
import { FlexContainer } from '../../components/flexbox';
import {
  FlexCol,
  FlexRow,
  Gradient,
  Transition,
} from '../../components/globals';
import Card from '../../components/card';

export const DashboardContainer = styled(FlexContainer)`
  margin-top: 32px;
`;

export const NotificationCard = styled(Card)`
  margin-bottom: 16px;
  padding: 16px 24px 24px 16px;
`;

export const ContentHeading = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
  margin: 8px 0;
`;

export const StatusBar = styled(FlexRow)`
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  border-radius: 12px 12px 0 0;
  background-color: ${({ theme }) => theme.brand.alt};
  background-image: ${({ theme }) => Gradient(theme.brand.alt, theme.brand.default)};
`;

export const Content = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
  margin-left: 40px;
  width: 100%;
`;

export const Message = styled(Content)`
  font-weight: 400;
  color: ${({ theme }) => theme.text.alt};
  margin-left: 8px;
  position: relative;
  top: -1px;

  a {
    font-weight: 700;
    transition: ${Transition.hover.off};
    position: relative;

    &:hover{
      color: ${({ theme }) => theme.brand.alt};
      transition: ${Transition.hover.on};
    }
  }
`;

export const HorizontalRuleWithIcon = styled(FlexRow)`
  position: relative;
  align-items: center;

  hr {
    display: inline-block;
    width: 50%;
    border-top: 2px solid ${props => props.theme.border.default};
  }

  div {
    margin: 0 16px;
  }

`;

export const ChatMessage = styled.p`
  position: relative;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  background-color: ${({ theme }) => theme.generic.alt};
  background-image: ${({ theme }) => Gradient(theme.generic.alt, theme.generic.default)};
  float: left;
  max-width: 75%;
  margin-top: 24px;

  &:before {
    content: attr(data-from);
    position: absolute;
    left: 16px;
    bottom: calc(100% + 4px);
    font-size: 11px;
    color: ${({ theme }) => theme.text.alt};
    font-weight: 600;
  }
`;
