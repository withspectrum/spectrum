import styled from 'styled-components';
import { Shadow, FlexRow } from '../../shared/Globals';

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

	@media (max-width: 768px) {
		overflow-y: auto;
	}
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
  theme.bg.default} url('/img/empty.svg') no-repeat center left;
	background-size: cover;
	opacity: 0.2;
`;

export const Footer = styled.div`
	display: flex;
	width: 100%;
	flex: 0 0 auto;
	align-self: flex-end;
	align-items: center;
	padding: 0;
	margin: 0;
	background-color: ${({ theme }) => theme.bg.default};

	@media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

export const LoginWrapper = styled(FlexRow)`
	width: calc(100% - 16px);
	margin: 0 8px;
	border-top: 2px solid ${props => props.theme.border.default};
	height: 64px;
	align-self: center;
	justify-content: center;

	> h4 {
		margin-right: 16px;
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
