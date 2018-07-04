// @flow
import styled from 'styled-components';
import { Transition, HorizontalRule } from '../globals';

export const MessagesWrapper = styled.div`
  flex: 1 0 auto;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;

export const MessageGroupContainer = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  margin-top: 20px;
`;

export const Timestamp = styled(HorizontalRule)`
  margin: 20px 0 0;
  text-align: center;
  user-select: none;

  hr {
    border-color: ${props => props.theme.bg.wash};
  }
`;

export const Byline = styled.span`
  display: flex;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  user-select: none;
  color: ${props => props.theme.text.default};
  max-width: 100%;
`;

export const Name = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.text.default};

  &:hover {
    color: ${({ theme }) => theme.brand.default};
    cursor: pointer;
  }
`;

export const Username = styled(Name)`
  font-weight: 400;
  margin-left: 2px;
  margin-right: 4px;
  color: ${props => props.theme.text.alt};
`;

export const UnseenRobotext = styled(Timestamp)`
  hr {
    border-color: ${props => props.theme.warn.alt};
    opacity: 0.1;
  }
`;

export const Time = styled.span`
  text-align: center;
  color: ${({ theme }) => theme.text.placeholder};
  font-size: 14px;
  font-weight: 400;
  margin: 0 16px;
  transition: ${Transition.hover.off};

  &:hover {
    color: ${({ theme }) => theme.text.alt};
    transiton: ${Transition.hover.on};
  }
`;

export const UnseenTime = styled(Time)`
  color: ${({ theme }) => theme.warn.alt};

  &:hover {
    color: ${({ theme }) => theme.warn.alt};
    transiton: ${Transition.hover.on};
  }
`;

export const MessageLink = styled.a`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  font-size: 12px;
  top: 0;
  color: ${({ theme }) => theme.text.alt};
  left: calc(100% + 4px);
`;

export const MessageNonLink = MessageLink.withComponent('span');
