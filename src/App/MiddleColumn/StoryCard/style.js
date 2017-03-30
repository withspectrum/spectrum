import styled from 'styled-components';
import { Gradient } from '../../../shared/Globals';

export const StoryBody = styled.div`
	display: inline-block;
	font-size: 16px;
	font-weight: 600;
	flex: 0 0 auto;
	max-width: 100%;
	word-wrap: break-word;
	margin-bottom: 8px;
	padding: 16px;
	padding-bottom: 8px;
`;

export const StoryFooter = styled.div`
	display: flex;
	justify-content: space-between;
	position: relative;
	padding: 6px 16px;
	border-top: 1px solid ${props => props.theme.border.default};
	background: #f6f7f8
	border-radius: 0 0 4px 4px;
`;

export const Title = styled.p`
	font-size: 20px;
	font-weight: 700;
	line-height: 24px;
	color: ${({ theme }) => theme.text.default};
`;

export const UnreadCount = styled.span`
	color: ${({ theme }) => theme.warn.default};
`;

export const LinkPreviewContainer = styled.div`
	margin: 16px 0 4px;
`;

export const HeadsContainer = styled.div`
	background: #fff;
	text-align: center
	display: flex;
	justify-content: flex-start;
	padding: 0 8px;
	border-radius: 0 0 4px 4px;
`;

export const JoinTheConvo = styled.span`
	color: ${({ theme }) => theme.brand.default};
	font-weight: 600;
	padding: 8px 0;
	font-size: 14px;
	align-self: flex-end;
`;

export const StatusBar = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	padding: 6px 16px;
	border-radius: 4px 4px 0 0;
	border-bottom: 1px solid ${props =>
  props.status === 'active' ? props.theme.brand.default : '#f6f7f8'};
	${props => props.status === 'active'
  ? `background: ${props.theme.brand.default};
		background-image: radial-gradient(ellipse farthest-corner at top left, ${props.theme.brand.alt} 0%, ${props.theme.brand.default} 100%);
		`
  : `background: #fff;`}
`;
export const StatusText = styled.p`
	font-size: 12px;
	font-weight: 400;
	color: #aab5c3;
	line-height: 1.2;
	margin-top: 8px;

	${props => props.status === 'active' ? `color: #fff; font-weight: 600;` : ''}

	${props => props.status === 'new'
  ? `color: ${props.theme.warn.default};
			 font-weight: 600;
			`
  : ''}

	${props => props.status === 'unread'
  ? `color: #00C384;
			 font-weight: 600;
			`
  : ''}
`;
export const Dot = styled.span`
	position: absolute;
	right: 10px;
	top: 16px;
	transform: translateY(-50%);
	width: 8px;
	height: 8px;
	border-radius: 8px;

	${props =>
  props.status === 'new'
    ? `background-color: ${props.theme.warn.default}`
    : `background-color: #00C384`}
`;

export const Name = styled(StatusText)`
	font-size: 13px;
	font-weight: ${props => props.status === 'active' ? '700' : '500'};
	margin-top: 4px;
	margin-bottom: 8px;
	color: ${props => props.status === 'active' ? '#fff' : props.theme.text.alt};

	a {
		text-overflow: ellipsis;
    overflow: hidden;
	}

	a:hover {
		color: ${props =>
  props.status === 'active' ? '#fff' : props.theme.brand.default};
		text-decoration: ${props => props.status === 'active' ? 'underline' : 'none'};
	}
`;
