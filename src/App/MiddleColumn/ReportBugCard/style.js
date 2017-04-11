import styled from 'styled-components';
import { H1, H4 } from '../../../shared/Globals';

export const Body = styled.div`
	width: 100%;
	min-height: 282px;
	padding: 24px 16px 16px;
	text-align: center;
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
    : 'font-size: 14px; margin: 0 0 32px;'}
	color: ${({ theme }) => theme.text.alt};
`;
