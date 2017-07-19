// @flow
// $FlowFixMe
import styled from 'styled-components';
import { Transition, HorizontalRule } from '../globals';
import { Avatar } from '../avatar';

export const UserAvatar = styled(Avatar)`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  align-self: flex-end;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* Rules below not implemented in browsers yet */
  -o-user-select: none;
  user-select: none;
  cursor: pointer;
`;

export const AvatarLabel = styled.div`
  display: inline-block;
  align-self: flex-end;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: 8px;
  margin-bottom: 1px;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 100%;
    height: 100%;
    width: 100%;
    box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, 0.15);
  }
`;

export const Byline = styled.span`
  display: flex;
  font-size: 11px;
  line-height: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  align-self: ${props => (props.me ? 'flex-end' : 'flex-start')};
  ${props => (props.me ? 'margin-right: 16px' : 'margin-left: 16px')};
  text-align: ${props => (props.me ? 'right' : 'left')};
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

export const BubbleGroupContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  margin-top: 16px;
  max-width: 70%;
  align-self: ${props => (props.me ? 'flex-end' : 'flex-start')};
  position: relative;
`;

export const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.me ? `flex-end;` : `flex-start;`)};
`;

export const MessageWrapper = styled.span`
  display: flex;
  align-self: ${props => (props.me ? `flex-end` : `flex-start`)};
  align-items: ${props => (props.me ? `flex-end` : `flex-start`)};
  justify-content: ${props => (props.me ? `flex-end` : `flex-start`)};
  padding: 1px 0;
  position: relative;

  &:after {
    transition: ${Transition.hover.off};
    content: ${props => (props.timestamp ? `'${props.timestamp}'` : '')};
    position: absolute;
    ${props =>
      props.me ? 'right: calc(100% + 8px)' : 'left: calc(100% + 8px)'};
    top: -4px;
    white-space: nowrap;
    font-size: 12px;
    color: ${({ theme }) => theme.text.alt};
    opacity: 0;
  }

  &:hover:after {
    opacity: 1;
    transition: ${Transition.hover.on};
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

export const Container = styled.div`
  flex: 1 0 auto;
  padding: 0 8px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;
