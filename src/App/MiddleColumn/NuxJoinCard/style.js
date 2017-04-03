import styled from 'styled-components';
import { H4, H1, Button } from '../../../shared/Globals';

export const Body = styled.div`
	width: 100%;
	padding: 24px 16px 16px;
	border-radius: 4px;
	text-align: center;
	overflow: hidden;
`;

export const Title = styled(H1)`
	width: 100%;
	margin: 0;
	margin-bottom: 8px;
	color: ${({ theme }) => theme.text.default};
`;

export const Description = styled(H4)`
	${props =>
  props.emoji
    ? 'font-size: 48px; margin: 16px 0 32px;'
    : 'font-size: 14px; margin: 0 0 32px;'}
	color: ${({ theme }) => theme.text.alt};
`;

export const Hscroll = styled.div`
	overflow-x: scroll;
	width: 100%;
	margin-left: -32px;
	width: calc(100% + 64px);
	display: flex;
	flex-direction: row;
	align-items: stretch;
	padding: 8px 24px 4px;
	background: transparent;
	/* both cursor declarations are needed for x-browser support */
	cursor: pointer;
	cursor: hand;
	cursor: grab;
	min-height: 275px;

	&:active {
		cursor: grabbing;
	}

	@media (max-width: 768px) {
		width: calc(100% + 48px);
	}
`;

export const FreqCard = styled.div`
	background: #fff;
	border-radius: 4px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-width: 164px;
	margin-left: 12px;
	border: 1px solid ${props => props.theme.border.default};
	box-shadow: 0 1px 4px rgba(0,0,0,0.04);
	transition: all 0.15s;

	&:last-of-type {
		margin-right: 24px;
	}

	img {
		width: 164px;
		height: 164px;
		border: 0;
		outline: none;
	}

	a {
		text-align: left;
		padding: 0 12px;
		line-height: 1.3;
		margin-top: 12px;
		font-size: 14px;
		font-weight: 800;
		color: ${({ theme }) => theme.text.default};
		display: block;

		&:hover {
			color: ${({ theme }) => theme.brand.default};
		}
	}

	h4 {
		font-size: 14px;
		font-weight: 400;
		color: ${({ theme }) => theme.text.alt};
		margin-bottom: 16px;
		margin-top: 8px;
		text-align: left;
		padding: 0 12px;
		line-height: 1.3;
	}

	&:hover {
		transition: all 0.15s;
		box-shadow: 0 2px 4px rgba(0,0,0,0.08);
	}
`;

export const Actions = styled.div`
	padding: 12px;
	padding-top: 0;
`;

export const JoinedButton = styled(Button)`
	background-image: none;
	background-color: ${({ theme }) => theme.bg.wash};
	border: none;
	color: ${({ theme }) => theme.text.alt};
`;

export const RightPadding = styled.div`
	min-width: 36px;
	background: transparent;
`;
