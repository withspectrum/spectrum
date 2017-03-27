import styled from 'styled-components';
import { H5 } from '../../../shared/Globals';

export const MessageGroupContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
	padding: 8px;
	align-items: center;
	box-shadow: inset -4px 0 ${props =>
  props.active ? props.theme.brand.default : 'transparent'};
`;

export const MessageGroupImagesContainer = styled.div`
	display: flex;
	margin-right: 8px;
	border: 1px solid ${({ theme }) => theme.border.default};
	overflow: hidden;
	min-width: 44px;
	width: 44px;
	min-height: 44px;
	height: 44px;
	border-radius: 4px;
`;

export const MessageGroupImage = styled.div`
	display: flex;
	width: 100%;
	background: ${props =>
  props.loading ? '#f6f7f8' : `url(${props.image}) no-repeat`};
	background-size: cover;
`;

export const MessageGroupTextContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 0 1 auto;
	overflow: hidden;
`;

export const MessageGroupByline = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

export const Usernames = styled.span`
	display: flex;
	flex: 1 1 auto;
	overflow: hidden;
	flex-wrap: nowrap;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	color: ${({ theme }) => theme.text.default};
	font-weight: 600;
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
	font-size: 10px;
	text-transform: uppercase;
	color: ${({ theme }) => theme.text.alt};
	padding-right: 4px;
	display: inline-block;
	line-height: 1;
	flex: 1 0 auto;
	margin-left: 8px;
`;

export const Snippet = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.text.alt};
	padding-right: 4px;
	display: inline-block;
	line-height: 1;
	margin-top: 4px;
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
