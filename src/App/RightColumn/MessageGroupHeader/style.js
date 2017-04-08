import styled from 'styled-components';
import { H1, H4 } from '../../../shared/Globals';

export const StoryContainer = styled.div`
	display: flex;
	flex: 0 0 auto;
	flex-direction: column;
	padding: 32px;

	@media (max-width: 768px) {
		padding: 16px;
		padding-top: 32px;
	}
`;

export const Header = styled.div`
	flex: 1 0 auto;
	align-self: flex-start;
	justify-content: space-between;
	width: 100%;
	display: flex;
	flex-direction: column;
	background-color: ${({ theme }) => theme.bg.default};

	@media (max-width: 768px) {
		display: none;
	}
`;

export const StoryTitle = styled(H1)`
	font-size: 32px;
	line-height: 40px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.default};
	padding-right: 32px;
	word-wrap: break-word;

	@media (max-width: 768px) {
		display: none;
	}
`;

export const Byline = styled(H4)`
	color: ${({ theme }) => theme.text.alt};
	margin-bottom: 8px;

	a {
		color: ${({ theme }) => theme.text.default};
	}

	@media (max-width: 768px) {
		display: none;
	}
`;
