import styled from 'styled-components';
import { H5 } from '../../../shared/Globals';

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
