import styled from 'styled-components';
import { Tooltip, Transition } from '../../../../shared/Globals';

export const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  align-self: flex-end;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */

  /* Rules below not implemented in browsers yet */
  -o-user-select: none;
  user-select: none;
  cursor: pointer;
`;

export const AvatarLabel = styled.span`
  align-self: flex-end;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  margin-right: 8px;
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
  color: ${props => (props.op ? props.theme.brand.default : props.theme.text.alt)};
  cursor: pointer;
  max-width: 100%;
`;

export const Name = styled.span`
  margin-right: 4px;
  &:hover {
    color: ${({ theme }) => theme.brand.default};
  }
`;

export const BubbleGroupContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  margin-top: 16px;
  max-width: 70%;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)}
  position: relative;
`;

export const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.me ? `flex-end;` : `flex-start;`)}
`;

export const MessageWrapper = styled.span`
  display: flex;
  align-self: ${props => (props.me ? `flex-end;` : `flex-start;`)}
  align-items: ${props => (props.me ? `flex-end;` : `flex-start;`)}
  justify-content: ${props => (props.me ? `flex-end;` : `flex-start;`)};
  padding: 1px 0;
  position: relative;

  &:after {
    transition: ${Transition.hover.off};
    content: ${props => (props.timestamp ? `'${props.timestamp}'` : '')};
    position: absolute;
    ${props => (props.me ? 'right: calc(100% + 8px)' : 'left: calc(100% + 8px)')};
    top: 8px;
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

export const Timestamp = styled.div`
	width: 100%;
	margin: 32px 0 16px;
	display: block;
	text-align: center;
	font-size: 12px;
	color: ${({ theme }) => theme.text.alt};
	position: relative;
	z-index: 0;
	-webkit-user-select: none; /* Chrome/Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+ */

	/* Rules below not implemented in browsers yet */
	-o-user-select: none;
	user-select: none;

	&:after {
		position: absolute;
		width: 100%;
		top: 16px;
		left: 0;
		right: 0;
		z-index: 4;
		content: '';
		border-bottom: 1px solid #f6f7f8;
	}
`;

export const Time = styled.span`
  margin: 0 auto;
  display: inline-block;
  padding: 4px 32px;
  background: #fff;
  position: relative;
  z-index: 5;
`;

export const Container = styled.div`
  flex: 1 0 auto;
  padding: 0 8px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  background: #fff;

  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;
