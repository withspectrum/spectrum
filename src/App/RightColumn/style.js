import styled from 'styled-components';
import { Shadow } from '../../shared/Globals';

export const ViewContainer = styled.div`
	display: flex;
	flex: 1 1 auto;
	height: 100%;
	overflow-y: hidden;
	flex-direction: column;
	position: relative;
	z-index: 3;
	background: #fff;
	overflow-x: hidden;
`;

export const StoryChatContainer = styled.div`
  overflow-y: scroll;
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	max-height: ${props => props.locked ? '100%' : 'calc(100% - 60px)'};
	overflow-x: hidden;
`;

export const NullContainer = styled.div`
	width: 110%;
	height: 110%;
	position: relative;
	background: ${({ theme }) =>
  theme.bg.default} url('./img/empty.svg') no-repeat center left;
	background-size: cover;
	opacity: 0.2;
	z-index: -1;
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

export const BackArrow = styled.span`
	margin-bottom: 16px;
	width: 100%;
	background: #fff;
	box-shadow: ${Shadow.low};
	height: 48px;
	align-items: center;
	display: none;
	padding-left: 8px;

	@media (max-width: 768px) {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}
`;
