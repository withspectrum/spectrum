import styled, { css } from 'styled-components';
import { Shadow, H5 } from '../../../shared/Globals';

export const Wrapper = styled.div`
	display: inline-block;
	width: calc(100% - 16px);
	margin: 8px 8px 0 8px;
	flex: 0 0 auto;
	border-radius: 4px;
	overflow: ${props => props.overflow === 'visible' ? 'visible' : 'hidden'};
	background-color: ${({ theme }) => theme.bg.default};
	transition: all 0.2s ease-in;
	-webkit-font-smoothing: subpixel-antialiased;
	box-shadow: ${Shadow.low};

	@media (max-width: 768px) {
		width: 100%;
		margin: 0;
		margin-bottom: 4px;
		border-radius: 0;

		&:first-of-type {
			margin-bottom: 8px;
		}
	}

	${props => !props.static &&
css`
		&:hover {
			box-shadow: ${Shadow.high};
			transition: all 0.2s ease-out;
			cursor: pointer;
		}
	`}
`;

export const LinkWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 0 0 auto;
	background-color: #ffffff;
	transition: all 0.2s ease-in;
	box-shadow: inset -4px 0 0 ${props =>
  props.selected ? props.theme.brand.default : '#fff'};

	&:hover {
		box-shadow: inset -4px 0 0 ${props =>
  props.selected ? props.theme.brand.default : '#fff'};
		transition: all 0.2s ease-in-out;
	}
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
