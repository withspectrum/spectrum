import styled from 'styled-components';
import { H4, H1 } from '../../../shared/Globals';

export const Body = styled.div`
	width: 100%;
	padding: 24px;
	text-align: center;
`;

export const Title = styled(H1)`
	width: 100%;
	margin: 0;
	margin-bottom: 16px;
	color: ${({ theme }) => theme.text.default};
`;

export const Description = styled(H4)`
	${props => props.emoji ? 'font-size: 48px; margin: 32px 0 8px;' : ''}
	color: ${({ theme }) => theme.text.default};
`;
