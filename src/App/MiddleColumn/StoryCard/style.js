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
	padding: 8px 16px;
	position: relative;

	&:after {
		content: '';
		border-bottom: 1px solid #f6f7f8;
		width: ${props => props.selected ? 'calc(100% - 4px)' : '100%'};
		display: inline-block;
		height: 0;
		bottom: 0;
		left: 0;
		position: absolute;
	}
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

export const LinkPreviewContainer = styled.div`
	margin: 16px 0 8px;
`;
