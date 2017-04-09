import styled from 'styled-components';
import { Gradient, H4, Transition, Shadow } from '../../../shared/Globals';

export const StoryBody = styled.div`
	display: inline-block;
	flex: 0 0 auto;
	max-width: 100%;
	word-wrap: break-word;
	padding: 24px;
	padding-top: 16px;
	padding-bottom: 16px;
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

export const FreqTag = styled(H4)`
	font-weight: 700;
	display: inline-block;
	align-self: flex-start;
	width: auto;
	line-height: 1;
	font-size: 14px;
	color: ${props => props.theme.text.placeholder};
	margin-bottom: 8px;
	transition: ${Transition.hover.off};

	&:hover {
		color: ${props => props.theme.brand.alt};
		transition: ${Transition.hover.on};
	}
`;

export const Title = styled.p`
	font-size: 20px;
	font-weight: 700;
	line-height: 1.2;
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
	min-height: ${props => props.size > 1 ? '140px' : '280px'};
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
	transition: ${Transition.hover.off};

	&:hover {
		transition: ${Transition.hover.on};
		transform: translateY(-2px);
		box-shadow: ${Shadow.mid};
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
	background: ${props => props.theme.bg.default};
	text-align: center;
	display: flex;
	justify-content: flex-start;
	margin-top: 12px;
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
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: relative;
	padding: 16px 16px 16px 24px;
	border-radius: 16px 16px 0 0;
	border-bottom: ${props =>
  props.status === 'active' || props.status === 'new'
    ? '0px solid transparent'
    : `2px solid ${props.theme.bg.wash}`};
	background-color: ${props =>
  props.status === 'active'
    ? props.theme.brand.default
    : props.status === 'new'
        ? props.theme.success.alt
        : props.status === 'unread'
            ? props.theme.warn.alt
            : props.theme.bg.default};
	background-image: ${props =>
  props.status === 'active'
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : 'none'};

	&:after {
		content: '';
    z-index: 1000;
    border: 8px solid transparent;
		position: absolute;
		left: calc(100% - 1px);
		top: calc(50% - 8px);
		border-radius: 2px;
		border-right-width: 0;
		border-left-color: ${props =>
  props.status === 'active' ? props.theme.brand.default : 'transparent'};
	}
`;

export const StatusText = styled.p`
	font-size: 14px;
	font-weight: ${props => props.status !== 'default' ? '900' : '700'};
	color: ${props =>
  props.status !== 'default' ? props.theme.text.reverse : props.theme.text.alt};
	line-height: 1;
	margin-top: 2px;
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
	font-size: 14px;
	font-weight: 700;
	margin-top: 8px;
	color: ${props => props.theme.text.alt};

	b {
		cursor: pointer;
		color: ${props =>
  props.status === 'active' ? '#fff' : props.theme.text.default};
	}

	b:hover {
		color: ${props =>
  props.status === 'active' ? '#fff' : props.theme.brand.default};
	}

	a {
		text-overflow: ellipsis;
    overflow: hidden;
	}

	a:hover {
		color: ${props => props.theme.brand.default};
	}
`;
