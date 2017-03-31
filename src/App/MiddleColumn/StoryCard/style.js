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

export const PhotosContainer = styled.div`
	margin: 16px 0 2px;
	border-radius: 4px;
	display: flex;
	flex-wrap: wrap;
`;

export const PhotoContainer = styled.div`
	position: relative;

	${props => props.size === 1
  ? `
		width: 100%;
		height: 280px;
		max-height: 280px;

		&:first-child img {
			border-radius: 4px;
		}
	`
  : ''}

	${props => props.size === 2
  ? `
		width: 49.5%;
		height: 140px;
		max-height: 140px;

		&:first-child {
			margin-right: 1%;
		}

		&:first-child img {
			border-radius: 4px 0 0 4px;
		}

		&:last-child img {
			border-radius: 0 4px 4px 0;
		}
	`
  : ''}

	${props => props.size === 3
  ? `
		width: 32.6%;
		margin-right: 1%
		height: 140px;
		max-height: 140px;

		&:first-child img {
			border-radius: 4px 0 0 4px;
		}

		&:last-child {
			margin-right: 0;
		}

		&:last-child img {
			border-radius: 0 4px 4px 0;
		}
	`
  : ''}

	${props => props.size >= 4
  ? `
		width: 24.25%;
		margin-right: 1%
		min-height: 108px;
		max-height: 140px;

		&:first-child img {
			border-radius: 4px 0 0 4px;
		}

		&:last-child {
			margin-right: 0;
		}

		&:last-child img {
			border-radius: 0 4px 4px 0;
		}
	`
  : ''}
`;

export const Photo = styled.img`
	object-fit: cover;
	display: flex;
	min-height: 100%;
	min-width: 100%;
	width: 100%;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
	transition: all 0.2s ease-in-out;

	&:hover {
		transition: all 0.2s ease-in-out;
		transform: translateY(-2px);
		box-shadow: 0 2px 4px rgba(0,0,0,0.16);
	}
`;

export const PhotoPlaceholder = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
	position: relative;
	background: #f6f7f8;
	position: absolute;

	&:after {
		content: '+${props => props.count}';
		position: absolute;
		left: 47%;
		top: 50%;
		font-size: 16px;
		color: ${props => props.theme.text.alt};
		transform: translate(-50%, -50%);
		font-weight: 800;
	}
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
  props.status === 'new' && `background-color: ${props.theme.warn.default}`};

	${props => props.status === 'unread' && `background-color: #00C384`};

	${props => props.status === 'active' && `background-color: transparent`};

	${props =>
  props.status !== 'active' &&
  props.status !== 'unread' &&
  props.status !== 'new' &&
  `background-color: transparent`};
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
