import styled from 'styled-components';
import { H4, H1, Button } from '../../../shared/Globals';

export const Body = styled.div`
	width: 100%;
	padding: 24px 16px 16px;
	text-align: center;
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
	overflow-x: auto;
	width: 100%;
	margin-left: -32px;
	width: calc(100% + 54px);
	display: flex;
	flex-direction: row;
	align-items: stretch;
	padding: 8px 24px;
	background: transparent;

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
	min-width: 172px;
	margin-left: 12px;
	box-shadow: 0 0 0 1px rgba(0,0,0,0.08);

	&:last-of-type {
		margin-right: 24px;
	}

	img {
		width: 172px;
		height: 172px;
		border: 0;
		outline: none;
	}

	h3, h4 {
		text-align: left;
		padding: 0 12px;
		line-height: 1.3;
	}

	h3 {
		margin-top: 12px;
		font-size: 14px;
		font-weight: 800;
		color: ${({ theme }) => theme.text.default};
	}

	h4 {
		font-size: 14px;
		font-weight: 400;
		color: ${({ theme }) => theme.text.alt};
		margin-bottom: 16px;
		margin-top: 8px;
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
	min-width: 24px;
	background: transparent;
`;
