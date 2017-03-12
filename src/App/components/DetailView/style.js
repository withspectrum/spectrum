import styled, { css } from 'styled-components';
import { H1, H4 } from '../../../shared/Globals';

export const Header = styled.div`
	flex: 0 0 auto;
	align-self: flex-start;
	width: 100%;
	display: flex;
	background-color: ${({ theme }) => theme.bg.default};
	padding: 32px;
`;

export const StoryTitle = styled(H1)`
	font-size: 28px;
	line-height: 40px;
	font-weight: 800;
	color: ${({ theme }) => theme.text.default};
`;

export const Byline = styled(H4)`
	color: ${({ theme }) => theme.brand.default};
`;

export const FlexColumn = styled.div`
	display:flex;
	flex-direction: column;
`;

export const ViewContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
	height: 100vh;
	overflow-y: scroll;
	flex-direction: column;
	position: relative;
	z-index: 3;
	background: #fff;
`;

export const LogicContainer = styled.div`
	flex: 1 0 auto;
	max-height: 100%;
	align-self: stretch;
	flex-direction: column;
	display: flex;
`;

export const NullContainer = styled.div`
	width: 110%;
	height: 110%;
	position: relative;
	background: ${({ theme }) =>
  theme.bg.default} url('./img/empty.svg') no-repeat center left;
	background-size: cover;
	opacity: 0.2;
`;

export const NullText = styled(H1)`
	position: relative;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0 auto;
	display: inline-block;
	color: ${({ theme }) => theme.text.alt};
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	align-items: center;
	padding: 8px;
	background-color: ${({ theme }) => theme.bg.wash};
	border-top: 1px solid ${({ theme }) => theme.border.default};
	${props => props.centered && `justify-content: center;`}

	@media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;
