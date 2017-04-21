import styled from 'styled-components';
import { Gradient, H4, Transition, Shadow } from '../../../shared/Globals';

export const StoryBody = styled.div`
	display: inline-block;
	flex: 0 0 auto;
	max-width: 100%;
	word-wrap: break-word;
	padding: 16px;
	padding-top: 12px;
	padding-bottom: 4px;
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
	font-weight: 500;
	display: inline-block;
	align-self: flex-start;
	width: auto;
	line-height: 1;
	font-size: 12px;
	color: ${props => props.theme.text.placeholder};
	margin-bottom: 8px;
	transition: ${Transition.hover.off};

	&:hover {
		color: ${props => props.theme.brand.alt};
		transition: ${Transition.hover.on};
	}
`;

export const Title = styled.p`
	font-size: 16px;
	font-weight: 700;
	line-height: 1.2;
	color: ${({ theme }) => theme.text.default};
`;

export const LinkPreviewContainer = styled.div`
	margin: 8px 0 16px 0;
`;

export const PhotosContainer = styled.div`
	margin: 8px 0 16px 0;
	border-radius: 4px;
	display: flex;
	flex-wrap: wrap;
	min-height: ${props => (props.size > 1 ? '140px' : '280px')};
`;

export const PhotoContainer = styled.div`
	position: relative;

	${props => (props.size === 1 ? `
		width: 100%;
		height: 280px;
		max-height: 280px;

		&:first-child img {
			border-radius: 4px;
		}
	` : '')}

	${props => (props.size === 2 ? `
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
	` : '')}

	${props => (props.size === 3 ? `
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
	` : '')}

	${props => (props.size >= 4 ? `
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
	` : '')}
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
	background-color: ${props => props.theme.bg.wash};
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
	margin-top: 8px;
	border-radius: 0 0 4px 4px;
`;

export const StatusBar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: relative;
	box-sizing: padding-box;
	padding: 12px 12px 12px 16px;
	border-radius: 12px 12px 0 0;
	margin-bottom: ${props => (props.status === 'active' || props.status === 'new' ? '2px' : '0')};
	border-bottom: ${props => (props.status === 'active' || props.status === 'new' ? '2px solid transparent' : `2px solid ${props.theme.bg.wash}`)};
	background-color: ${props => (props.status === 'active' ? props.theme.brand.default : props.status === 'new' ? props.theme.success.alt : props.status === 'unread' ? props.theme.warn.alt : props.theme.bg.default)};
	background-image: ${props => (props.status === 'active' ? Gradient(props.theme.brand.alt, props.theme.brand.default) : 'none')};

	&:after {
		content: '';
    z-index: 1000;
    border: 8px solid transparent;
		position: absolute;
		left: calc(100% - 1px);
		top: calc(50% - 6px);
		border-radius: 2px;
		border-right-width: 0;
		border-left-color: ${props => (props.status === 'active' ? props.theme.brand.default : 'transparent')};
	}
`;

export const StatusText = styled.p`
	font-size: 12px;
	font-weight: ${props => (props.status !== 'default' ? '700' : '500')};
	color: ${props => (props.status !== 'default' ? props.theme.text.reverse : props.theme.text.alt)};
	line-height: 1;
	margin-top: 2px;
`;

export const Name = styled(StatusText)`
	font-size: 12px;
	font-weight: 500;
	margin-top: 8px;
	color: ${props => props.theme.text.alt};
	display: inline;

	&:hover {
		color: ${props => props.theme.brand.default};
	}

	b {
		cursor: pointer;
		color: ${props => (props.status === 'active' ? props.theme.text.reverse : props.theme.text.default)};
	}

	b:hover {
		color: ${props => (props.status === 'active' ? props.theme.text.reverse : props.theme.brand.default)};
	}

	a {
		text-overflow: ellipsis;
    overflow: hidden;
	}

	a:hover {
		color: ${props => props.theme.brand.default};
	}
`;
