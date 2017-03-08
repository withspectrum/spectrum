import styled from 'styled-components';
import { H1, Label, Input } from '../../../shared/Globals';

export const Body = styled.div`
	width: 100%;
	padding: 24px;
`;

export const Title = styled(H1)`
	width: 100%;
	margin: 0;
	margin-bottom: 16px;
	color: ${({ theme }) => theme.text.default};
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	margin-top: 24px;
	text-align: center;
	justify-content: center;

	> button:last-of-type {
		margin-left: 24px;
	}
`;
