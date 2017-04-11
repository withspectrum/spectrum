import styled from 'styled-components';
import { H1, H4 } from '../../../shared/Globals';

export const Actions = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 24px;
`;

export const Body = styled.div`
	width: 100%;
	padding: 12px 16px 16px;
	overflow: hidden;
`;

export const Title = styled(H1)`
	width: 100%;
	margin: 0;
	margin-bottom: 8px;
	color: ${({ theme }) => theme.text.default};
	line-height: 1.4;
`;

export const Description = styled(H4)`
	${props =>
  props.emoji
    ? 'font-size: 48px; margin: 16px 0 32px;'
    : 'font-size: 14px; margin: 0'}
	color: ${({ theme }) => theme.text.alt};
`;

export const Count = styled(Description)`
	margin-bottom: 12px;
	font-weight: 800;
`;
