import styled from 'styled-components';
import {
  FlexRow,
  FlexCol,
  Gradient,
  Transition,
} from '../../components/globals';
import Card from '../../components/card';

export const NotificationCard = styled(Card)`
  padding: 16px 24px 24px 16px;
`;

export const ContentHeading = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
  margin: 8px 0;
`;

export const NotificationListContentHeading = styled(ContentHeading)`
  font-size: 16px;
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

export const NotificationListContainer = styled(FlexCol)`
  flex: 0 1 480px;
  overflow-y: scroll;
`;

export const NotificationListContent = styled(Content)`
  margin-left: 0;
  padding-left: 8px;
`;

export const Message = styled.p`
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.4;
  color: inherit;
  margin-left: 16px;
  position: relative;

  a {
    font-weight: 700;
    transition: ${Transition.hover.off};
    position: relative;

    &:hover{
      color: inherit;
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

export const NotificationListRow = styled(FlexRow)`
  padding: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  align-items: center;
  color: ${({ theme }) => theme.text.default};

  b {
    font-weight: 700;
  }

  div {
    color: ${({ theme }) => theme.success.default};
  }

  &:hover {
    background-color: ${({ theme }) => theme.brand.alt};
    color: ${({ theme }) => theme.text.reverse};

    div {
      color: inherit;
    }
  }
`;
