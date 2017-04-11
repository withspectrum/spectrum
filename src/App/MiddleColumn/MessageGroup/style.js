import styled from 'styled-components';
import { H5 } from '../../../shared/Globals';

export const MessageGroupContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
	padding: 16px 8px 16px 16px;
	align-items: center;
	overflow: hidden;
	${props =>
  props.active
    ? `box-shadow: inset -4px 0 ${props.theme.brand.default}`
    : `transparent`};
	${props =>
  props.active ? `background: ${props.theme.bg.wash}` : `background: #fff`};
	transition: all 0.15s ease-in-out;

	&:after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 16px;
		width: calc(100% - 48px);
		border-bottom: 1px solid #f6f7f8;
	}
`;

export const MessageGroupImagesContainer = styled.div`
	display: flex;
	margin-right: 12px;
	min-width: 44px;
	width: 44px;
	min-height: 44px;
	height: 44px;
	border-radius: 44px;
`;

export const MessageGroupImage = styled.div`
	display: flex;
	width: 100%;
	border-radius: 44px;
	background: ${props =>
  props.loading ? '#f6f7f8' : `url(${props.image}) no-repeat`};
	background-size: cover;
	${props =>
  props.unread
    ? `border: 2px solid #fff; box-shadow: 0 0 0 1px ${props.theme.brand.default};`
    : ''};
`;

export const MessageGroupTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 0 calc(100% - 64px);
	overflow: hidden;
`;

export const MessageGroupByline = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: baseline;
`;

export const Usernames = styled.span`
	display: flex;
	overflow: hidden;
	flex-wrap: nowrap;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }) => theme.text.default};
	font-weight: ${props => props.unread ? 800 : 600};
	line-height: 1.2;
	margin-bottom: 2px;
	font-size: 14px;
	flex: 1 1 100%;

	p {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 100%;
	}
`;

export const Timestamp = styled.span`
	font-size: 12px;
	text-align: right;
	color: ${props => props.unread ? props.theme.brand.default : '#909aa7'};
	padding-right: 4px;
	display: inline-block;
	flex: 1 0 auto;
	margin-left: 8px;
`;

export const Snippet = styled.p`
	font-size: 13px;
	font-weight: ${props => props.unread ? 700 : 500};
	color: ${props =>
  props.unread ? props.theme.text.default : props.theme.text.alt};
	padding-right: 4px;
	display: inline-block;
	line-height: 1.3;
	margin-top: 0;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const StoryBody = styled.div`
	display: inline-block;
	font-size: 16px;
	font-weight: 600;
	flex: 0 0 auto;
	max-width: 100%;
	word-wrap: break-word;
	margin-bottom: 8px;
	padding: 16px;
	padding-bottom: 4px;
`;

export const StoryFooter = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
	border-top: 1px solid #f6f7f8;
	padding: 8px 16px;
	background: #fff;
`;

export const Title = styled.p`
	font-size: 16px;
	font-weight: 400;
	line-height: 24px;
	color: ${({ theme }) => theme.text.default};
`;

export const Name = styled(H5)`
  color: ${({ theme }) => theme.text.alt};
	display: flex;
	align-items: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	max-width: 100%;

	a {
		text-overflow: ellipsis;
    overflow: hidden;
	}

	a:hover {
		color: ${({ theme }) => theme.brand.default};
	}
`;

export const MessageCount = styled(Name)`
	margin-top: 4px;
`;

export const UnreadCount = styled.span`
	color: ${({ theme }) => theme.warn.default};
`;
