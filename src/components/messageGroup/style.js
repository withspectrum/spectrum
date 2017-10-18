// @flow
import styled from 'styled-components';
import { Transition, HorizontalRule } from '../globals';

export const Wrapper = styled.div`
  flex: 1 0 auto;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  max-width: 100%;

  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;

export const Sender = styled.div`
  display: flex;
  flex: none;
  margin: 16px 16px 0;
  align-items: flex-end;
  justify-content: ${props => (props.me ? 'flex-end' : 'flex-start')};
  position: relative;
`;

export const MessageGroup = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  max-width: 100%;
  margin-left: ${props => (props.me ? `0` : `8px`)};
  align-items: ${props => (props.me ? `flex-end` : `flex-start`)};
`;

export const Byline = styled.span`
  display: flex;
  font-size: 11px;
  line-height: 16px;
  font-weight: 700;
  margin-bottom: 0;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  color: ${props =>
    props.op ? props.theme.brand.default : props.theme.text.alt};
  max-width: 100%;
`;

export const Name = styled.span`
  margin-right: 4px;
  &:hover {
    color: ${({ theme }) => theme.brand.default};
    cursor: pointer;
  }
`;

export const Timestamp = styled(HorizontalRule)`
  margin: 16px 32px 8px 32px;
  text-align: center;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* Rules below not implemented in browsers yet */
  -o-user-select: none;
  user-select: none;

  hr {
    border-color: ${props => props.theme.bg.wash};
  }
`;

export const Time = styled.span`
  text-align: center;
  color: ${({ theme }) => theme.text.placeholder};
  font-size: 12px;
  font-weight: 500;
  margin: 0 16px;
  transition: ${Transition.hover.off};

  &:hover {
    color: ${({ theme }) => theme.text.alt};
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

  ${props => (props.me ? 'right: calc(100% + 4px)' : 'left: calc(100% + 4px)')};
`;

export const MessageNonLink = MessageLink.withComponent('span');
